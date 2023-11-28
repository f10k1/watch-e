import { Module, forwardRef } from "@nestjs/common";
import { DeviceService } from "./device.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Device } from "./device.entity";
import { DeviceController } from "./device.controller";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/user/user.module";
import { NotificationModule } from "src/notification/notification.module";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    imports: [
        TypeOrmModule.forFeature([Device]),
        ClientsModule.register([
            { name: 'MQTT_SERVICE', transport: Transport.MQTT }
        ]),
        AuthModule,
        forwardRef(() => UserModule),
        forwardRef(() => NotificationModule)],
    controllers: [DeviceController],
    providers: [DeviceService],
    exports: [DeviceService]
})
export class DeviceModule { }