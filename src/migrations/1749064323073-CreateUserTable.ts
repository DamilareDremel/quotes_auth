import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1749064323073 implements MigrationInterface {
    name = 'CreateUserTable1749064323073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "quote" ALTER COLUMN "tags" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quote" ALTER COLUMN "tags" SET DEFAULT ''`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
