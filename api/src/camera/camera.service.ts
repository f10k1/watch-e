import { Injectable } from "@nestjs/common";
import { Camera } from "./camera.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCameraDto } from "./camera.dto";
import { UserService } from "src/user/user.service";
import { Account } from "src/user/user.entity";
import * as Crypto from "crypto";

@Injectable()
export class CameraService {
    constructor(@InjectRepository(Camera) private cameraRepository: Repository<Camera>) { }

    async findById(id: number): Promise<Camera | undefined> {
        return this.cameraRepository.findOne({ where: { id }, relations: { account: true } });
    }

    async create(cameraDto: CreateCameraDto, user: Account): Promise<Camera> {
        const key = Crypto.randomBytes(48).toString("hex");
        const notification = await this.cameraRepository.create({ name: cameraDto.name, key, account: user });
        return await this.cameraRepository.save(notification);
    }

    async getAll(user: Account): Promise<Camera[] | null> {
        return await this.cameraRepository.find({
            where: {
                account: user
            }
        });
    }

    async remove(camera: Camera): Promise<void> {
        await this.cameraRepository.remove([camera]);
    }

    async update(camera: Camera, cameraDto: CreateCameraDto) {
        await this.cameraRepository.update({ id: camera.id }, cameraDto);
    }

    async findByKey(key: string) {
        return await this.cameraRepository.findOne({ where: { key }, relations: { account: true } });
    }
}