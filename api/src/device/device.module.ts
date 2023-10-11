import { Module } from "@nestjs/common";
import { DeviceService } from "./device.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Device } from "./device.entity";
import { DeviceController } from "./device.controller";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/user/user.module";
import { DeviceGateway } from "./device.gateway";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
    imports: [TypeOrmModule.forFeature([Device]), AuthModule, UserModule],
    controllers: [DeviceController],
    providers: [DeviceService, DeviceGateway],
    exports: [DeviceService]
})
export class DeviceModule { }