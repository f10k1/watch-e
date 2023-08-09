"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1691606053207 = void 0;
class Migration1691606053207 {
    constructor() {
        this.name = 'Migration1691606053207';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TYPE "public"."notification_type_enum" RENAME TO "notification_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_type_enum" AS ENUM('SUCCESS', 'ERROR', 'WARNING', 'INFO')`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "type" TYPE "public"."notification_type_enum" USING "type"::"text"::"public"."notification_type_enum"`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "type" SET DEFAULT 'INFO'`);
        await queryRunner.query(`DROP TYPE "public"."notification_type_enum_old"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."notification_type_enum_old" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "type" TYPE "public"."notification_type_enum_old" USING "type"::"text"::"public"."notification_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "type" SET DEFAULT '3'`);
        await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_type_enum_old" RENAME TO "notification_type_enum"`);
    }
}
exports.Migration1691606053207 = Migration1691606053207;
//# sourceMappingURL=1691606053207-migration.js.map