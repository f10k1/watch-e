import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Param, Patch, Post, Req } from "@nestjs/common";
import { Public } from "src/metadata.guard";
import { Request } from "express";
import { CameraService } from "src/camera/camera.service";
import { CreateCameraDto } from "./camera.dto";
import { UserService } from "src/user/user.service";
import { Camera } from "./camera.entity";

@Controller("notification")
export class CameraController {

    constructor(private cameraService: CameraService, private userService: UserService) { }

    @HttpCode(HttpStatus.CREATED)
    @Post("add")
    @Public()
    async add(@Req() req: Request, @Body() cameraDto: CreateCameraDto) {
        const user = await this.userService.findById(req.user["sub"]);

        if (!user) return new ForbiddenException("User not provided.");

        try {
            const camera = await this.cameraService.create(cameraDto, user);

            return { camera };
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

        const cameras: Camera[] = await this.cameraService.getAll(user);

        return cameras;
    }

    @HttpCode(HttpStatus.OK)
    @Patch(':id')
    async updateNotification(@Req() req: Request, @Param() params: any, @Body() cameraDto: CreateCameraDto) {
        if (!params.id) return new BadRequestException("Provide camera id");

        const camera = await this.cameraService.findById(params.id);

        if (!camera) return new NotFoundException();

        if (camera.account.id !== req.user["sub"]) return new ForbiddenException();

        try {
            await this.cameraService.update(camera, cameraDto);
        } catch {
            return new InternalServerErrorException("Something went wrong.");
        }
    }

    @HttpCode(HttpStatus.OK)
    @Delete(':id')
    async deleteNotification(@Req() req: Request, @Param() params: any) {
        if (!params.id) return new BadRequestException("Provide camera id");

        const camera = await this.cameraService.findById(params.id);

        if (!camera) return new NotFoundException();

        if (camera.account.id !== req.user["sub"]) return new ForbiddenException();

        try {
            await this.cameraService.remove(camera);
        } catch {
            return new InternalServerErrorException("Something went wrong.");
        }
    }
}