import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsEnum, IsNumber, IsObject, IsString, ValidateIf, ValidateNested } from "class-validator";
import { DeviceTypes } from "./device.entity";

class DeviceSettings {

    @IsBoolean()
    @ValidateIf((object, value) => object.type === "input")
    notificationOnMovement: boolean;

    @IsBoolean()
    notificationOnDisconnect: boolean;

    @IsEnum(DeviceTypes, { message: "Device type must be input or output" })
    type: DeviceTypes;
}

export class CreateDeviceDto {
    @IsString()
    name: string;

    @IsObject()
    @Type(() => DeviceSettings)
    settings: DeviceSettings;
}

export class ChangeDeviceDto extends CreateDeviceDto {
    @IsNumber()
    id: number;
}

export class DeleteDeviceDto {
    @IsArray({ message: "Provide list of ids" })
    @ArrayMinSize(1)
    @Type(() => Number)
    targets: number[];
}