import { Device } from "~/types/device";

export interface Notification {
    id: number,
    content: string,
    type: NotificationTypes,
    seen: boolean,
    movement: boolean,
    title: string,
    device: Device,
    created_at: Date,
}

export enum NotificationTypes {
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    WARNING = "WARNING",
    INFO = "INFO"
}