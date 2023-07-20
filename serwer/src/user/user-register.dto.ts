import { IsEmail, Matches, Max, MaxLength, Min, MinLength } from "class-validator";

export class RegisterUserDto {
    @MinLength(4, {message: "Value must be at least 4 characters long"})
    @MaxLength(36, {message: "Value must be at most 36 characters long"})
    username: string;

    @IsEmail({}, {message: "Value must be valid email address"})
    email: string;

    @MinLength(6, {message: "Value must be at least 6 characters long"})
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password is too weak' })
    password: string

    @MinLength(6, {message: "Value must be at least 6 characters long"})
    passwordConfirm: string;
}