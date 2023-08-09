import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req } from "@nestjs/common";
import { Public } from "src/metadata.guard";
import { NotificationDto } from "./notification.dto";
import { NotificationService } from "./notification.service";
import { Request } from "express";
import { Notification } from "./notification.entity";
import { Account } from "src/user/user.entity";

@Controller("notification")
export class NotificationController {

    constructor(private notificationService: NotificationService) { }

    @HttpCode(HttpStatus.CREATED)
    @Post("add")
    @Public()
    async add(@Body() notificationDto: NotificationDto) {
        try {
            await this.notificationService.create(notificationDto);
        }
        catch {
            throw new HttpException("something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @HttpCode(HttpStatus.OK)
    @Get("all")
    async getAll(@Req() req: Request) {
        const notifications: Notification[] = await this.notificationService.getAll((req.user as Account).id);

        return notifications;
    }
}