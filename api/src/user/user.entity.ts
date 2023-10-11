import { Device } from "src/device/device.entity";
import { Notification } from "src/notification/notification.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Notification, (notification) => notification.account)
    notifications: Notification[];

    @OneToMany(() => Device, (device) => device.account)
    devices: Device[];
}