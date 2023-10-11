import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsString } from "class-validator";

export class CreateDeviceDto {
    @IsString()
    name: string;
}

export class DeleteDeviceDto {
    @IsArray({message: "Provide list of ids"})
    @ArrayMinSize(1)
    @Type(() => Number)
    targets: number[];
}