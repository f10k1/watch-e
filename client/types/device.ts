export interface Device {
    id: number,
    name: string,
    key: string,
    accessible?: boolean,
    settings: DeviceSettings;
}

interface DeviceSettings {
    notificationOnDisconnect: boolean,
    type: "input" | "output",
    notificationOnMovement?: boolean,
    active: boolean,
    input?: string
}