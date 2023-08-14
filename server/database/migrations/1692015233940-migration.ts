import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692015233940 implements MigrationInterface {
    name = 'Migration1692015233940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "cameraId" integer`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_aab52f1465c3fc488592216b199" FOREIGN KEY ("cameraId") REFERENCES "camera"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_aab52f1465c3fc488592216b199"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "cameraId"`);
    }

}
