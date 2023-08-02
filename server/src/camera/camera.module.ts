import { Module } from "@nestjs/common";
import { CameraService } from "./camera.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Camera } from "./camera.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Camera])],
    providers: [CameraService],
    exports: [CameraService]
})
export class CameraModule { }