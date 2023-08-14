import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1691843337097 implements MigrationInterface {
    name = 'Migration1691843337097'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "created_at"`);
    }

}
