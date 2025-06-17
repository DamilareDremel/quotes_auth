import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdToQuote1750156165330 implements MigrationInterface {
    name = 'AddUserIdToQuote1750156165330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quote" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "quote" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "quote" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "quote" DROP COLUMN "tags"`);
        await queryRunner.query(`ALTER TABLE "quote" ADD "tags" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "quote" ADD CONSTRAINT "FK_bcbf020650ca118abc4cc1ceead" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quote" DROP CONSTRAINT "FK_bcbf020650ca118abc4cc1ceead"`);
        await queryRunner.query(`ALTER TABLE "quote" DROP COLUMN "tags"`);
        await queryRunner.query(`ALTER TABLE "quote" ADD "tags" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quote" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "quote" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "quote" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
