import { BadRequestException, Body, Controller, ForbiddenException, Get, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Param, Patch, Post, Req } from "@nestjs/common";
import { Public } from "src/metadata.guard";
import { NotificationDto } from "./notification.dto";
import { NotificationService } from "./notification.service";
import { Request } from "express";
import { Notification } from "./notification.entity";
import { Account } from "src/user/user.entity";
import { CameraService } from "src/camera/camera.service";
import { NotificationGateway } from "./notification.gateway";

@Controller("notification")
export class NotificationController {

    constructor(private notificationService: NotificationService, private cameraService: CameraService, private notificationGateway: NotificationGateway) { }

    @HttpCode(HttpStatus.CREATED)
    @Post("add")
    @Public()
    async add(@Body() notificationDto: NotificationDto) {
        const camera = await this.cameraService.findById(notificationDto.camera);

        if (!camera) return new ForbiddenException("Camera not found");

        try {
            const notification = await this.notificationService.create(notificationDto, camera);

            this.notificationGateway.sendNotification(notification, camera.account.id);
        }
        catch (err) {
            return new InternalServerErrorException("Something went wrong.");
        }
    }

    @HttpCode(HttpStatus.OK)
    @Get("all")
    async getAll(@Req() req: Request) {
        const notifications: Notification[] = await this.notificationService.getAll(req.user["sub"]);

        return notifications;
    }

    @HttpCode(HttpStatus.OK)
    @Patch(':id')
    async updateNotification(@Req() req: Request, @Param() params: any) {
        if (!params.id) return new BadRequestException("Provide notification id");

        const notification = await this.notificationService.getOneById(params.id);

        if (!notification) return new NotFoundException();

        console.log(notification.account.id, req.user);

        if (notification.account.id !== req.user["sub"]) return new ForbiddenException();

        try {
            await this.notificationService.markAsSeen(notification);
        } catch {
            return new InternalServerErrorException("Something went wrong.");
        }
    }
}