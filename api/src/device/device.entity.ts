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

    @ManyToOne(() => Account, (account) => account.devices)
    account: Account;

    @OneToMany(() => Notification, (notification) => notification.device)
    notifications: Notification[];
}