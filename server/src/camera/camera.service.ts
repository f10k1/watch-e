import { Injectable } from "@nestjs/common";
import { Camera } from "./camera.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class CameraService {
    constructor(@InjectRepository(Camera) private cameraRepository: Repository<Camera>) { }

    async findById(id: number): Promise<Camera | undefined> {
        return this.cameraRepository.findOneBy({ id });
    }
}