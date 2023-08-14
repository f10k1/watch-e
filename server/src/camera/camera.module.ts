import { Module } from "@nestjs/common";
import { CameraService } from "./camera.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Camera } from "./camera.entity";
import { CameraController } from "./camera.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Camera])],
    controllers: [CameraController],
    providers: [CameraService],
    exports: [CameraService]
})
export class CameraModule { }