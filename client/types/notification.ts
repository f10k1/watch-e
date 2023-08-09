export interface Notification{
    id: number,
    content: string,
    type: NotificationTypes,
    seen: boolean
}

export enum NotificationTypes {
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    WARNING = "WARNING",
    INFO = "INFO"
}