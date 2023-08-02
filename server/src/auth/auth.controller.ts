import { Body, Controller, Post, HttpCode, HttpStatus, BadRequestException } from "@nestjs/common";
import { Public } from "src/metadata.guard";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @Public()
    signIn(@Body() signInDto: Record<string, string>) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @HttpCode(HttpStatus.OK)
    @Post('user')
    @Public()
    async getUserData(@Body() body: { token: string; }) {
        const user = await this.authService.getUser(body.token);

        if (!user) return new BadRequestException({ "token": "Your token is invalid" });

        return user;
    }

}