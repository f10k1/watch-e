import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Notification } from "./notification.entity";
import { Server, Socket } from "socket.io";
import { AuthService } from "src/auth/auth.service";
import { NotificationService } from "./notification.service";
import { Inject, forwardRef } from "@nestjs/common";


@WebSocketGateway({ namespace: 'notification', cors: { origin: "http://localhost:3000", serveClient: false } })
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(private authService: AuthService, @Inject(forwardRef(() => NotificationService)) private notificationService: NotificationService) { }

    @WebSocketServer()
    server: Server;

    private connectedUsers: Map<string, number> = new Map();

    async handleConnection(client: Socket) {
        const [type, token] = client.handshake?.headers?.authorization?.split(' ') ?? [];

        if (type !== "Bearer" || !token) {
            client.disconnect();
            return;
        }

        const user = await this.authService.getUser(token);

        if (!user) {
            client.disconnect();
            return;
        };
        this.connectedUsers.set(client.id, user.id);
    };

    @SubscribeMessage('notifications')
    async getAllNotifications(@ConnectedSocket() client: Socket) {
        const notifications = await this.notificationService.getAll(client.data.id);
        client.emit("notifications", notifications ?? []);
    }

    sendNotification(notification: Notification, userId: number) {
        let client;

        for (let [key, value] of this.connectedUsers.entries()) {
            if (userId !== value) continue;

            client = key;
            break;
        }

        if (!client) return;
        (this.server.sockets as any).get(client).emit("notification", notification);
    }

    handleDisconnect(client: Socket) {
        this.connectedUsers.delete(client.id);
    }

}