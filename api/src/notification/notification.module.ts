import { Module, forwardRef } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Notification } from "./notification.entity";
import { NotificationService } from "./notification.service";
import { CameraModule } from "src/camera/camera.module";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/user/user.module";
import { NotificationGateway } from "./notification.gateway";

@Module({
    imports: [
        TypeOrmModule.forFeature([Notification]),
        CameraModule,
        AuthModule,
        UserModule
    ],
    providers: [NotificationService, NotificationGateway],
    controllers: [NotificationController],
    exports: [NotificationService]
})
export class NotificationModule { }