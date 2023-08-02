import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from "@nestjs/common";
import { Public } from "src/metadata.guard";
import { NotificationDto } from "./notification.dto";
import { NotificationService } from "./notification.service";

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
}