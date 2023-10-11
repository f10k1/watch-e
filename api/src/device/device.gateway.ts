import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "ws";
import { AuthService } from "src/auth/auth.service";
import { Inject, forwardRef } from "@nestjs/common";
import { DeviceService } from "./device.service";
import { DeviceSocket, UserSocket } from "src/types.global";
import { Device } from "./device.entity";
import { Account } from "src/user/user.entity";
import { SchedulerRegistry } from "@nestjs/schedule";
import { json } from "stream/consumers";

@WebSocketGateway({ path: '/device', })
export class DeviceGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(private authService: AuthService, @Inject(forwardRef(() => DeviceService)) private deviceService: DeviceService, private schedulerRegistry: SchedulerRegistry) { }

    @WebSocketServer()
    server: Server;

    async handleConnection(client: DeviceSocket | UserSocket, req: { rawHeaders: string[]; }) {
        const [type, token] = req.rawHeaders[req.rawHeaders.findIndex((header: string) => header.toLowerCase() === "authorization") + 1].split(" ") ?? [];

        if (type !== "Bearer" && type !== "Key" || !token) {
            client.close();
            return;
        }
        if (type === "Bearer") {
            const user = await this.authService.getUser(token);

            if (!user) {
                client.close();
                return;
            };

            client.entity = user;
            client.sockets = new Map();

            const devices: number[] = [];

            for (let value of (this.server.clients as Set<UserSocket | DeviceSocket>).values()) {

                if (value.entity instanceof Account && value.entity.id === client.entity.id) continue;

                if (!(value.entity instanceof Device) || (value.entity as Device).account.id !== user.id) continue;

                (value as DeviceSocket).sockets.set(user.id, client as UserSocket);
                value.send(JSON.stringify({ type: "active" }));

                (client as UserSocket).sockets.set(value.entity.id, value as DeviceSocket);

                devices.push(value.entity.id);
            }

            client.send(JSON.stringify({ type: "availables", message: devices }));

            return;
        }

        const device = await this.deviceService.findByKey(token);

        if (!device) {
            client.close();
            return;
        }

        client.entity = device;
        const userClients: UserSocket[] = [];

        for (let value of (this.server.clients as Set<UserSocket | DeviceSocket>).values()) {

            if (value.entity instanceof Device && value.entity.id === client.entity.id) continue;

            if (value.entity instanceof Device && value.entity.id === device.id) {
                client.close();
                return;
            }

            if (!(value.entity instanceof Account) || (value.entity as Account).devices.findIndex(entity => device.id === entity.id) === -1) continue;

            userClients.push(value as UserSocket);
        }

        client.sockets = new Map();

        let timeout;

        client.on("message", (data) => {
            const parsedData = JSON.parse(data.toString());

            if (parsedData.type === "movement") {
                client.sockets.forEach((socket) => {
                    socket.send(data);
                });
            }
        });

        client.on("pong", () => {
            this.schedulerRegistry.deleteTimeout(device.key);
        });

        const interval = setInterval(() => {
            client.ping();
            timeout = setTimeout(() => {
                client.close();
                this.schedulerRegistry.deleteTimeout(device.key);
                this.schedulerRegistry.deleteInterval(device.key);
            }, 10000);

            this.schedulerRegistry.addTimeout(device.key, timeout);
        }, 20000);

        this.schedulerRegistry.addInterval(device.key, interval);

        if (userClients.length === 0) {
            client.send(JSON.stringify({ type: "idle" }));
            return;
        }

        client.send(JSON.stringify({ type: "active" }));

        userClients.forEach(userClient => {

            userClient.sockets.set(device.id, client as DeviceSocket);
            userClient.send(JSON.stringify({ type: "accessible", message: device.id }));

            (client as DeviceSocket).sockets.set(userClient.entity.id, userClient);
        });
    };

    handleDisconnect(client: DeviceSocket | UserSocket) {

        if (!client.sockets) return;

        //If device disconnected then let user know it's inaccessible
        if (client.entity instanceof Device) {
            client.sockets.forEach(user => {
                user.sockets.delete(client.entity.id);

                user.send(JSON.stringify({ type: 'inaccessible', message: client.entity.id }));
            });
            return;
        }

        //After user disconnect set his device's to idle mode
        client.sockets.forEach(device => {
            const deviceSocket = device;
            deviceSocket.sockets.delete(client.entity.id);
            if (deviceSocket.sockets.size === 0) device.send(JSON.stringify({ type: 'idle' }));
        });
    }
}