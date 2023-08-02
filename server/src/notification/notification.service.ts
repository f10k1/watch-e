import { ForbiddenException, Inject, Injectable, InternalServerErrorException, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NotificationDto } from "./notification.dto";
import { CameraService } from "src/camera/camera.service";
import { Notification } from "./notification.entity";
import { NotificationGateway } from "./notification.gateway";
import { UserService } from "src/user/user.service";

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification) private notificationRepository: Repository<Notification>,
        private cameraService: CameraService,
        @Inject(forwardRef(() => NotificationGateway))
        private notificationGateway: NotificationGateway,
        private userService: UserService
    ) { };

    async create(notificationDto: NotificationDto): Promise<void | ForbiddenException | InternalServerErrorException> {

        const camera = await this.cameraService.findById(notificationDto.camera);

        if (!camera) return new ForbiddenException("Camera not found");

        const notification = await this.notificationRepository.create({ content: notificationDto.content, type: notificationDto.type, account: camera.account });

        try {
            await this.notificationRepository.save(notification);

            this.notificationGateway.sendNotification(notification, camera.account.id);
        } catch {
            return new InternalServerErrorException("There was an error during notification saving");
        }
    }

    async getAll(userId: number): Promise<Notification[] | null> {
        const user = await this.userService.findById(userId);

        if (!user) return null;

        return await this.notificationRepository.findBy({
            account: user
        });
    }
}