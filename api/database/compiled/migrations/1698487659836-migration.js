"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1698487659836 = void 0;
class Migration1698487659836 {
    constructor() {
        this.name = 'Migration1698487659836';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "device" ADD "settings" json NOT NULL DEFAULT '{"notificationOnDisconnect":false,"type":"input","notificationOnMovement":false}'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "settings"`);
    }
}
exports.Migration1698487659836 = Migration1698487659836;
//# sourceMappingURL=1698487659836-migration.js.map