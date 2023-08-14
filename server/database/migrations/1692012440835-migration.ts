import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692012440835 implements MigrationInterface {
    name = 'Migration1692012440835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "movement" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "movement"`);
    }

}
