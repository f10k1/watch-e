import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NotificationDto } from "./notification.dto";
import { Notification } from "./notification.entity";
import { UserService } from "src/user/user.service";
import { Device } from "src/device/device.entity";
import { Account } from "src/user/user.entity";

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification) private notificationRepository: Repository<Notification>,
        private userService: UserService
    ) { };

    async create(notificationDto: Partial<NotificationDto>, device: Device): Promise<Notification> {

        const notification = await this.notificationRepository.create({ content: notificationDto.content, type: notificationDto.type, account: device.account });

        return await this.notificationRepository.save(notification);
    }

    async getAll(user: Account): Promise<Notification[] | null> {
        return await this.notificationRepository.find({
            where: {
                account: user
            },
            order: {
                created_at: "DESC"
            }
        });
    }

    async findById(notificationId: number): Promise<Notification | null> {
        return await this.notificationRepository.findOne({ where: { id: notificationId }, relations: { account: true } });
    }

    async markAsSeen(notification: Notification): Promise<void> {
        await this.notificationRepository.update({ id: notification.id }, { seen: true });
    }

    async remove(notification: Notification): Promise<void> {
        await this.notificationRepository.remove([notification]);
    }
}