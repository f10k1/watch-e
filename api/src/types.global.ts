import { Socket } from "socket.io";
import { Account } from "./user/user.entity";
import { Camera } from "./camera/camera.entity";

export interface CustomSocket<T> extends Socket {
    sockets?: Map<number,Socket>,
    entity: T,
}