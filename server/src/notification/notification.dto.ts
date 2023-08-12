import { IsEnum, IsNumber, MaxLength, MinLength } from "class-validator";
import { NotificationTypes } from "./notification.types";

export class NotificationDto {

    @IsNumber(null, { message: "Provide camera Id" })
    camera: number;

    @MinLength(4, { message: "Value must be at least 4 characters long" })
    @MaxLength(255, { message: "Value must be at most 36 characters long" })
    content: string;

    @IsEnum(NotificationTypes, { message: "Value must be one of accepted types" })
    type: NotificationTypes;

    @MinLength(4, { message: "Value must be at least 4 characters long" })
    @MaxLength(36, { message: "Value must be at most 36 characters long" })
    title: string;
}