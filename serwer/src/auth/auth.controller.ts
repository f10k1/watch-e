import { Body, Controller, Post, HttpCode, HttpStatus } from "@nestjs/common";
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

}