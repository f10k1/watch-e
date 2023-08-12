import { ForbiddenException, Inject, Injectable, InternalServerErrorException, NotFoundException, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NotificationDto } from "./notification.dto";
import { CameraService } from "src/camera/camera.service";
import { Notification } from "./notification.entity";
import { NotificationGateway } from "./notification.gateway";
import { UserService } from "src/user/user.service";
import { Camera } from "src/camera/camera.entity";

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification) private notificationRepository: Repository<Notification>,
        private userService: UserService
    ) { };

    async create(notificationDto: NotificationDto, camera: Camera): Promise<Notification> {

        const notification = await this.notificationRepository.create({ content: notificationDto.content, type: notificationDto.type, account: camera.account });

        return await this.notificationRepository.save(notification);

    }

    async getAll(userId: number): Promise<Notification[] | null> {
        const user = await this.userService.findById(userId);

        if (!user) return null;

        return await this.notificationRepository.find({
            where: {
                account: user
            },
            order: {
                created_at: "DESC"
            }
        });
    }

    async getOneById(notificationId: number): Promise<Notification | null> {
        return await this.notificationRepository.findOne({ where: { id: notificationId }, relations: { account: true } });
    }

    async markAsSeen(notification: Notification): Promise<void> {
        await this.notificationRepository.update({ id: notification.id }, { seen: true });
    }
}