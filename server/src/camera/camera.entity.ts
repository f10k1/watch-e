import { Notification } from "src/notification/notification.entity";
import { Account } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Camera {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    key: string;

    @ManyToOne(() => Account, (account) => account.cameras)
    account: Account;
}