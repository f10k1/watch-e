import { Camera } from "src/camera/camera.entity";
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

    @OneToMany(() => Camera, (camera) => camera.account)
    cameras: Camera[];
}