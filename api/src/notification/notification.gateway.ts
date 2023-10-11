import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Notification } from "./notification.entity";
import { Server, WebSocket } from "ws";
import { AuthService } from "src/auth/auth.service";
import { UserSocket } from "src/types.global";


@WebSocketGateway({ path: '/notification', cors: { origin: "http://localhost:3000" } })
export class NotificationGateway implements OnGatewayConnection {

    constructor(private authService: AuthService) { }

    @WebSocketServer()
    server: Server;

    async handleConnection(client: UserSocket, req: { rawHeaders: string[]; }) {
        const [type, token] = req.rawHeaders[req.rawHeaders.findIndex((header: string) => header === "Authorization") + 1].split(" ") ?? [];

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
    };

    sendNotification(notification: Notification, userId: number) {
        for (let client of this.server.clients.values()) {
            if ((client as UserSocket).entity.id !== userId) continue;

            client.emit("notification", notification);
            return;
        }
    }
}