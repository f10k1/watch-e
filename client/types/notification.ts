import { Camera } from "~/types/camera";

export interface Notification {
    id: number,
    content: string,
    type: NotificationTypes,
    seen: boolean,
    movement: boolean,
    title: string,
    camera: Camera,
    created_at: Date,
}

export enum NotificationTypes {
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    WARNING = "WARNING",
    INFO = "INFO"
}