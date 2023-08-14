"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1692015482757 = void 0;
class Migration1692015482757 {
    constructor() {
        this.name = 'Migration1692015482757';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "notification" ADD "cameraId" integer`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_aab52f1465c3fc488592216b199" FOREIGN KEY ("cameraId") REFERENCES "camera"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_aab52f1465c3fc488592216b199"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "cameraId"`);
    }
}
exports.Migration1692015482757 = Migration1692015482757;
//# sourceMappingURL=1692015482757-migration.js.map