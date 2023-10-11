import { Injectable } from "@nestjs/common";
import { Device } from "./device.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateDeviceDto } from "./device.dto";
import { UserService } from "src/user/user.service";
import { Account } from "src/user/user.entity";
import * as Crypto from "crypto";

@Injectable()
export class DeviceService {
    constructor(@InjectRepository(Device) private deviceRepository: Repository<Device>) { }

    async findById(id: number): Promise<Device | undefined> {
        return this.deviceRepository.findOne({ where: { id }, relations: { account: true } });
    }

    async create(deviceDto: CreateDeviceDto, user: Account): Promise<Device> {
        const key = Crypto.randomBytes(48).toString("hex");
        const notification = await this.deviceRepository.create({ name: deviceDto.name, key, account: user });
        return await this.deviceRepository.save(notification);
    }

    async getAll(user: Account): Promise<Device[] | null> {
        return await this.deviceRepository.find({
            where: {
                account: user
            }
        });
    }

    async remove(device: Device): Promise<void> {
        await this.deviceRepository.remove([device]);
    }

    async update(device: Device, deviceDto: CreateDeviceDto) {
        await this.deviceRepository.update({ id: device.id }, deviceDto);
    }

    async findByKey(key: string) {
        return await this.deviceRepository.findOne({ where: { key }, relations: { account: true } });
    }
}