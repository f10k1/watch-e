import { Module } from "@nestjs/common";
import { CameraService } from "./camera.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Camera } from "./camera.entity";
import { CameraController } from "./camera.controller";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/user/user.module";
import { CameraGateway } from "./camera.gateway";

@Module({
    imports: [TypeOrmModule.forFeature([Camera]), AuthModule, UserModule],
    controllers: [CameraController],
    providers: [CameraService, CameraGateway],
    exports: [CameraService]
})
export class CameraModule { }