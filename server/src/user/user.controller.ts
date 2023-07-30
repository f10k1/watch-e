import { Body, Controller, ForbiddenException, HttpCode, HttpException, HttpStatus, Post, UnprocessableEntityException } from "@nestjs/common";
import { Public } from "src/metadata.guard";
import { UserService } from "./user.service";
import { RegisterUserDto } from "./user-register.dto";

@Controller("user")
export class UserController {

    constructor(private userService: UserService) { };

    @HttpCode(HttpStatus.CREATED)
    @Post("register")
    @Public()
    async signUp(@Body() signUpDto: RegisterUserDto) {
        if (await this.userService.checkIfExists(signUpDto.username, signUpDto.email) > 0) throw new ForbiddenException({ "register": "User exists" });

        if (signUpDto.password !== signUpDto.passwordConfirm) throw new UnprocessableEntityException({ "passwordConfirm": "Password confirmation must be same as password" });

        try {
            await this.userService.create(signUpDto);
        }
        catch {
            throw new HttpException("something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}