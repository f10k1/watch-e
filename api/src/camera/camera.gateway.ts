import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AuthService } from "src/auth/auth.service";
import { Inject, forwardRef } from "@nestjs/common";
import { CameraService } from "./camera.service";
import { CustomSocket } from "src/types.global";
import { Camera } from "./camera.entity";
import { Account } from "src/user/user.entity";

@WebSocketGateway({ namespace: 'camera', cors: { origin: "http://localhost:3000" }, serveClient: false })
export class CameraGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(private authService: AuthService, @Inject(forwardRef(() => CameraService)) private cameraService: CameraService) { }

    @WebSocketServer()
    server: Server;

    async handleConnection(client: CustomSocket<Camera | Account>) {
        const [type, token] = client.handshake?.headers?.authorization?.split(' ') ?? [];

        if (type !== "Bearer" && type !== "Key" || !token) {
            client.disconnect();
            return;
        }

        if (type === "Bearer") {
            const user = await this.authService.getUser(token);

            if (!user) {
                client.disconnect();
                return;
            };

            client.entity = user;
            client.sockets = new Map();

            const cameras: number[] = [];

            for (let [key, value] of (this.server.sockets as any as Map<string, CustomSocket<Account>>).entries()) {
                if (!(value instanceof Camera) || (value.entity as any as Camera).account.id !== user.id) continue;

                value.sockets.set(user.id, client);
                value.emit("active");

                client.sockets.set(value.entity.id, value);

                cameras.push(value.entity.id);
            }

            client.emit("availables", cameras);

            return;
        }

        const camera = await this.cameraService.findByKey(token);

        if (!camera) {
            client.disconnect();
            return;
        }

        client.sockets = new Map();
        client.entity = camera;

        const userClients: string[] = [];

        for (let [key, value] of (this.server.sockets as unknown as Map<string, CustomSocket<Camera | Account>>).entries()) {

            if (value instanceof Camera && value.entity.id === camera.id) {
                client.disconnect();
                return;
            }

            if (!(value instanceof Account) || (value.entity as Account).cameras.findIndex(entity => camera.id === entity.id) === -1) continue;

        }

        userClients.forEach(userClient => {
            const value = (this.server.sockets as unknown as Map<string, CustomSocket<Camera | Account>>).get(userClient);

            value.sockets.set(camera.id, client);
            value.emit("accessible", camera.id);

            client.sockets.set(value.entity.id, value);
        });
    };

    handleDisconnect(client: CustomSocket<Camera | Account>) {
        //If camera disconnected then let user know it's inaccessible
        if (client.entity instanceof Camera) {
            client.sockets.forEach(user => {
                (this.server.sockets as unknown as Map<string, CustomSocket<Camera | Account>>).get(user.id).sockets.delete(client.entity.id);

                user.emit('inaccessible', client.entity.id);
            });
            return;
        }

        //After use disconnect set his camera's to idle mode
        client.sockets.forEach(camera => {
            const cameraSocket = (this.server.sockets as unknown as Map<string, CustomSocket<Camera | Account>>).get(camera.id);
            cameraSocket.sockets.delete(client.entity.id);
            if (cameraSocket.sockets.size === 0) camera.emit('idle');
        });
    }
}