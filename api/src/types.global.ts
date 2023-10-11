import { WebSocket } from "ws";
import { Account } from "./user/user.entity";
import { Device } from "./device/device.entity";

export interface UserSocket extends WebSocket {
    sockets?: Map<number, DeviceSocket>,
    entity: Account,
}

export interface DeviceSocket extends WebSocket {
    sockets?: Map<number, UserSocket>,
    entity: Device,
}