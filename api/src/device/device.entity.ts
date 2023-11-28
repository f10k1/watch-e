import { Notification } from "src/notification/notification.entity";
import { Account } from "src/user/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Device {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    key: string;

    @Column({
        type: 'json', default: {
            notificationOnDisconnect: false,
            type: "input",
            notificationOnMovement: false,
            active: true
        }
    })
    settings: DeviceSettings;

    @ManyToOne(() => Account, (account) => account.devices)
    account: Account;

    @OneToMany(() => Notification, (notification) => notification.device)
    notifications: Notification[];
}

export interface DeviceSettings {
    notificationOnDisconnect: boolean,
    type: "input" | "output",
    notificationOnMovement: boolean,
    input?: string,
    active: boolean
}

export enum DeviceTypes {
    input = "input",
    output = "output"
}