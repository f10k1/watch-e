import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Param, Patch, Post, Req } from "@nestjs/common";
import { Public } from "src/metadata.guard";
import { NotificationDto } from "./notification.dto";
import { NotificationService } from "./notification.service";
import { Request } from "express";
import { Notification } from "./notification.entity";
import { DeviceService } from "src/device/device.service";
import { UserService } from "src/user/user.service";
import { UserGateway } from "src/user/user.gateway";

@Controller("notification")
export class NotificationController {

    constructor(private notificationService: NotificationService, private deviceService: DeviceService, private userGateway: UserGateway, private userService: UserService) { }

    @HttpCode(HttpStatus.CREATED)
    @Post("add")
    @Public()
    async add(@Body() notificationDto: NotificationDto) {
        const device = await this.deviceService.findById(notificationDto.device);

        if (!device) return new ForbiddenException("Device not found");

        try {
            const notification: Notification = await this.notificationService.create(notificationDto, device);

            this.userGateway.sendNotification(notification, device.account.id);
        }
        catch (err) {
            return new InternalServerErrorException("Something went wrong.");
        }
    }

    @HttpCode(HttpStatus.OK)
    @Get("all")
    async getAll(@Req() req: Request) {
        const user = await this.userService.findById(req.user["sub"]);

        if (!user) return new ForbiddenException("User not provided.");

        const notifications: Notification[] = await this.notificationService.getAll(user);

        return notifications;
    }

    @HttpCode(HttpStatus.OK)
    @Patch(':id')
    async updateNotification(@Req() req: Request, @Param() params: any) {
        if (!params.id) return new BadRequestException("Provide notification id");

        const notification = await this.notificationService.findById(params.id);

        if (!notification) return new NotFoundException();

        if (notification.account.id !== req.user["sub"]) return new ForbiddenException();

        try {
            await this.notificationService.markAsSeen(notification);
        } catch {
            return new InternalServerErrorException("Something went wrong.");
        }
    }

    @HttpCode(HttpStatus.OK)
    @Delete(':id')
    async deleteNotification(@Req() req: Request, @Param() params: any) {
        if (!params.id) return new BadRequestException("Provide notification id");

        const notification = await this.notificationService.findById(params.id);

        if (!notification) return new NotFoundException();

        if (notification.account.id !== req.user["sub"]) return new ForbiddenException();

        try {
            await this.notificationService.remove(notification);
        } catch {
            return new InternalServerErrorException("Something went wrong.");
        }
    }
}