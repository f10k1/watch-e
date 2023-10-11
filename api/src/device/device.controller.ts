import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Param, Patch, Post, Req } from "@nestjs/common";
import { Public } from "src/metadata.guard";
import { Request } from "express";
import { DeviceService } from "src/device/device.service";
import { CreateDeviceDto, DeleteDeviceDto } from "./device.dto";
import { UserService } from "src/user/user.service";
import { Device } from "./device.entity";

@Controller("device")
export class DeviceController {

    constructor(private deviceService: DeviceService, private userService: UserService) { }

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
}