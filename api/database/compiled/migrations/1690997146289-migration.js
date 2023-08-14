"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1690997146289 = void 0;
class Migration1690997146289 {
    constructor() {
        this.name = 'Migration1690997146289';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."notification_type_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "type" "public"."notification_type_enum" NOT NULL DEFAULT '3', "seen" boolean NOT NULL DEFAULT false, "accountId" integer, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "camera" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "key" character varying NOT NULL, "accountId" integer, CONSTRAINT "PK_3e6992bc5e67b9f9a6f95a5fe6f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_00abcf7b2089a5c05f0aedc5676" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "camera" ADD CONSTRAINT "FK_b7750f072e5dadb8e4e3359f2e8" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "camera" DROP CONSTRAINT "FK_b7750f072e5dadb8e4e3359f2e8"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_00abcf7b2089a5c05f0aedc5676"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea"`);
        await queryRunner.query(`DROP TABLE "camera"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
    }
}
exports.Migration1690997146289 = Migration1690997146289;
//# sourceMappingURL=1690997146289-migration.js.map