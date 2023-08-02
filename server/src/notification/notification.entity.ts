import { IsEmail, Matches, Min } from "class-validator";
import { Account } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NotificationTypes } from "./notification.types";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column({
        type: "enum",
        enum: NotificationTypes,
        default: NotificationTypes.INFO
    })
    type: NotificationTypes;

    @Column({
        type: "boolean",
        default: false
    })
    seen: boolean;

    @ManyToOne(() => Account, (account) => account.notifications)
    account: Account;
}