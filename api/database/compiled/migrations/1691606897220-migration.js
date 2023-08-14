"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1691606897220 = void 0;
class Migration1691606897220 {
    constructor() {
        this.name = 'Migration1691606897220';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "notification" ADD "title" character varying NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "title"`);
    }
}
exports.Migration1691606897220 = Migration1691606897220;
//# sourceMappingURL=1691606897220-migration.js.map