import { IsBoolean, IsDate, IsDateString, IsEnum, IsNumber, MaxLength, MinLength, ValidateIf } from "class-validator";
import { NotificationTypes } from "./notification.types";

export class NotificationDto {

    @IsNumber(null, { message: "Provide device Id" })
    device: number;

    @MinLength(4, { message: "Value must be at least 4 characters long" })
    @MaxLength(255, { message: "Value must be at most 36 characters long" })
    content: string;

    @IsEnum(NotificationTypes, { message: "Value must be one of accepted types" })
    type: NotificationTypes;

    @MinLength(4, { message: "Value must be at least 4 characters long" })
    @MaxLength(36, { message: "Value must be at most 36 characters long" })
    title: string;
}

export class FilterNotificationDto {
    @IsBoolean({ message: "Value must be a boolean" })
    @ValidateIf((object, value) => value !== null)
    movement: boolean;

    @IsDateString(null, { message: "Value must be a valid date string" })
    @ValidateIf((object, value) => value !== null)
    from: string;

    @IsDateString(null, { message: "Value must be a valid date string" })
    @ValidateIf((object, value) => value !== null)
    to: string;

    @IsNumber(null, { message: "Device Id must be an number" })
    @ValidateIf((object, value) => value !== null)
    device: number;
}