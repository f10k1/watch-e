import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from "@nestjs/common";
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
        if (await this.userService.checkIfExists(signUpDto.username, signUpDto.email) > 0) throw new HttpException("user exists", HttpStatus.FORBIDDEN);

        if (signUpDto.password !== signUpDto.passwordConfirm) throw new HttpException("password confirmation must be same as password", HttpStatus.BAD_REQUEST);

        try {
            await this.userService.create(signUpDto);
        }
        catch {
            throw new HttpException("something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}