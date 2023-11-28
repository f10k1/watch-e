import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "ws";
import { AuthService } from "src/auth/auth.service";
import { Inject, forwardRef } from "@nestjs/common";
import { Notification } from "src/notification/notification.entity";
import { WebSocketEntity } from "src/types.global";
import { Account } from "./user.entity";

@WebSocketGateway({ path: '/user', })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {

    private users: Map<number, WebSocketEntity<Account>> = new Map();

    constructor(private authService: AuthService) { }

    @WebSocketServer()
    server: Server;

    async handleConnection(client: WebSocketEntity<Account>, req: { rawHeaders: string[]; }) {
        const [type, token] = req.rawHeaders[req.rawHeaders.findIndex((header: string) => header.toLowerCase() === "authorization") + 1].split(" ") ?? [];
        if (type !== "Bearer" || !token) {
            client.close();
            return;
        }

        const user = await this.authService.getUser(token);

        if (!user) {
            client.close();
            return;
        };

        client.entity = user;

        this.users.set(user.id, client);

        return;
    };

    handleDisconnect(client: any) {
        this.users.delete(client.entity.id);
    }

    handleDeviceConnect(deviceId: number, userId: number) {
        const client = this.users.get(userId);

        if (!client) return;

        client.send(JSON.stringify({
            type: "accessible",
            message: deviceId
        }));
    }

    handleDeviceDisconnect(deviceId: number, userId: number) {
        const client = this.users.get(userId);

        if (!client) return;

        client.send(JSON.stringify({
            type: "inaccessible",
            message: deviceId
        }));
    }

    sendNotification(notification: Notification, userId: number) {
        const client = this.users.get(userId);

        if (!client) return;

        client.send(JSON.stringify({
            type: "notification",
            message: notification
        }));
    }
}