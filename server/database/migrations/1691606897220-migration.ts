import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1691606897220 implements MigrationInterface {
    name = 'Migration1691606897220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "title" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "title"`);
    }

}
