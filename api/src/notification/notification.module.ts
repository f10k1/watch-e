import { Module, forwardRef } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Notification } from "./notification.entity";
import { NotificationService } from "./notification.service";
import { DeviceModule } from "src/device/device.module";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/user/user.module";
import { NotificationGateway } from "./notification.gateway";

@Module({
    imports: [
        TypeOrmModule.forFeature([Notification]),
        DeviceModule,
        AuthModule,
        UserModule
    ],
    providers: [NotificationService, NotificationGateway],
    controllers: [NotificationController],
    exports: [NotificationService]
})
export class NotificationModule { }