import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1698487659836 implements MigrationInterface {
    name = 'Migration1698487659836'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" ADD "settings" json NOT NULL DEFAULT '{"notificationOnDisconnect":false,"type":"input","notificationOnMovement":false}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "settings"`);
    }

}
