import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTravelEntity1732447887632 implements MigrationInterface {
  name = 'AddTravelEntity1732447887632';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."mood_mood_enum" AS ENUM('nature', 'relax', 'history', 'culture', 'party')`,
    );
    await queryRunner.query(
      `CREATE TABLE "mood" ("id" SERIAL NOT NULL, "mood" "public"."mood_mood_enum" NOT NULL, "score" smallint NOT NULL, "travelId" uuid, CONSTRAINT "PK_cd069bf46deedf0ef3a7771f44b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "travel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying(100) NOT NULL, "name" character varying(100) NOT NULL, "description" text NOT NULL, "startingDate" TIMESTAMP NOT NULL, "endingDate" TIMESTAMP NOT NULL, "price" bigint NOT NULL, "availableSeats" smallint NOT NULL DEFAULT '0', CONSTRAINT "PK_657b63ec7adcf2ecf757a490a67" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_travel_dates" ON "travel" ("startingDate") `,
    );
    await queryRunner.query(
      `ALTER TABLE "mood" ADD CONSTRAINT "FK_036204eb36aaa6bcab81f1153c0" FOREIGN KEY ("travelId") REFERENCES "travel"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mood" DROP CONSTRAINT "FK_036204eb36aaa6bcab81f1153c0"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_travel_dates"`);
    await queryRunner.query(`DROP TABLE "travel"`);
    await queryRunner.query(`DROP TABLE "mood"`);
    await queryRunner.query(`DROP TYPE "public"."mood_mood_enum"`);
  }
}