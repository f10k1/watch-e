import { IsEmail, Matches, Min } from "class-validator";
import { Account } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NotificationTypes } from "./notification.types";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

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

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;

    @ManyToOne(() => Account, (account) => account.notifications)
    account: Account;
}