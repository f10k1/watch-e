import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, Inject, InternalServerErrorException, NotFoundException, Param, Patch, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { DeviceService } from "src/device/device.service";
import { CreateDeviceDto, DeleteDeviceDto } from "./device.dto";
import { UserService } from "src/user/user.service";
import { Device } from "./device.entity";
import { ClientProxy, Ctx, MessagePattern, MqttContext, Payload } from "@nestjs/microservices";
import { UserGateway } from "src/user/user.gateway";
import { SchedulerRegistry } from "@nestjs/schedule";
import { NotificationTypes } from "src/notification/notification.types";
import { NotificationService } from "src/notification/notification.service";

@Controller("device")
export class DeviceController {

    constructor(private deviceService: DeviceService, private userService: UserService, private userGateway: UserGateway, private schedulerRegistry: SchedulerRegistry, private notificationService: NotificationService, @Inject('MQTT_SERVICE') private client: ClientProxy,) { }

    @HttpCode(HttpStatus.CREATED)
    @Post("")
    async add(@Req() req: Request, @Body() deviceDto: CreateDeviceDto) {
        const user = await this.userService.findById(req.user["sub"]);

        if (!user) return new ForbiddenException("User not provided.");

        try {
            const device = await this.deviceService.create(deviceDto, user);

            return device;
        }
        catch (err) {
            return new InternalServerErrorException("Something went wrong.");
        }
    }

    @HttpCode(HttpStatus.OK)
    @Get("")
    async getAll(@Req() req: Request) {
        const user = await this.userService.findById(req.user["sub"]);

        if (!user) return new ForbiddenException("User not provided.");

        const devices: Device[] = await this.deviceService.getAll(user);

        return devices;
    }

    @HttpCode(HttpStatus.OK)
    @Patch(':id')
    async updateNotification(@Req() req: Request, @Param() params: any, @Body() deviceDto: CreateDeviceDto) {
        if (!params.id) return new BadRequestException("Provide device id");

        const device = await this.deviceService.findById(params.id);

        if (!device) return new NotFoundException();

        if (device.account.id !== req.user["sub"]) return new ForbiddenException();

        try {
            await this.deviceService.update(device, deviceDto);

            this.client.send(`${device.key}/settings`, { ...device.settings });
        } catch {
            return new InternalServerErrorException("Something went wrong.");
        }
    }

    @HttpCode(HttpStatus.OK)
    @Delete('')
    async deleteNotification(@Req() req: Request, @Body() deleteDeviceDto: DeleteDeviceDto) {
        const { targets } = deleteDeviceDto;

        if (!targets || targets.length === 0) return new BadRequestException("Provide devices to delete");

        const devices: Device[] = [];

        for (let id of targets) {
            const device = await this.deviceService.findById(id);

            if (!device) return new NotFoundException();

            if (device.account.id !== req.user["sub"]) return new ForbiddenException();

            devices.push(device);
        }

        try {
            devices.forEach(async (device) => await this.deviceService.remove(device));
        } catch {
            return new InternalServerErrorException("Something went wrong.");
        }
    }

    @MessagePattern("+/status")
    async deviceStatus(@Payload() data: string, @Ctx() context: MqttContext) {
        const [key] = context.getTopic().split('/');

        const device = await this.deviceService.findByKey(key);

        if (!device) return;

        const interval = setInterval(() => {
            this.userGateway.handleDeviceDisconnect(device.id, device.account.id);
        }, 20000);

        if (!this.schedulerRegistry.getInterval(key)) {
            this.userGateway.handleDeviceConnect(device.id, device.account.id);

            this.schedulerRegistry.addInterval(key, interval);

            return;
        }

        this.schedulerRegistry.deleteInterval(key);

        this.schedulerRegistry.addInterval(key, interval);
    }

    @MessagePattern("+/movement")
    async trackMovement(@Payload() data: boolean, @Ctx() context: MqttContext) {
        const [key] = context.getTopic().split('/');

        const device = await this.deviceService.findByKey(key);

        if (!device || !device.settings.notificationOnMovement) return;

        try {
            const content = data ? `Movement started` : `Movement stopped`;
            const notification = await this.notificationService.create({ content, type: NotificationTypes.INFO }, device);

            this.userGateway.sendNotification(notification, device.account.id);
        }
        catch (err) {
            console.log(err);
        }
    }
}