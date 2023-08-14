"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1691843337097 = void 0;
class Migration1691843337097 {
    constructor() {
        this.name = 'Migration1691843337097';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "notification" ADD "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "created_at"`);
    }
}
exports.Migration1691843337097 = Migration1691843337097;
//# sourceMappingURL=1691843337097-migration.js.map