"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1689099880252 = void 0;
class Migration1689099880252 {
    constructor() {
        this.name = 'Migration1689099880252';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "account" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "account"`);
    }
}
exports.Migration1689099880252 = Migration1689099880252;
//# sourceMappingURL=1689099880252-migration.js.map