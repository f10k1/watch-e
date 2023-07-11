import { IsEmail, Matches, Max, MaxLength, Min, MinLength } from "class-validator";

export class RegisterUserDto {
    @MinLength(4)
    @MaxLength(36)
    username: string;

    @IsEmail()
    email: string;

    @MinLength(6)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
    password: string

    @MinLength(6)
    passwordConfirm: string;
}