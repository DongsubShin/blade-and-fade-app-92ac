import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1715000000000 implements MigrationInterface {
    name = 'InitialSchema1715000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create Enums
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'barber', 'client')`);
        await queryRunner.query(`CREATE TYPE "public"."bookings_status_enum" AS ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show')`);
        await queryRunner.query(`CREATE TYPE "public"."queue_entries_status_enum" AS ENUM('waiting', 'serving', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('sms', 'email')`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_status_enum" AS ENUM('scheduled', 'sent', 'failed')`);

        // Create Tables
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "full_name" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'client', CONSTRAINT "UQ_97672df88af87152a3f12b964e2" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_97672df88af87152a3f12b964e" ON "users" ("email") `);
        
        await queryRunner.query(`CREATE TABLE "services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "description" text, "duration_minutes" integer NOT NULL, "price" decimal(10,2) NOT NULL, "category" character varying, CONSTRAINT "PK_ba2d347131683007dd5c56e339d" PRIMARY KEY ("id"))`);
        
        await queryRunner.query(`CREATE TABLE "barbers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "working_hours" jsonb, CONSTRAINT "REL_3666016668740f907869677332" UNIQUE ("user_id"), CONSTRAINT "PK_96016668740f907869677332761" PRIMARY KEY ("id"))`);
        
        await queryRunner.query(`CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "phone" character varying, "visit_count" integer NOT NULL DEFAULT 0, "notes" text, CONSTRAINT "REL_66016668740f90786967733276" UNIQUE ("user_id"), CONSTRAINT "PK_f1361137451ba9d201ab69f4f51" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_phone_clients" ON "clients" ("phone") `);

        await queryRunner.query(`CREATE TABLE "bookings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "client_id" uuid NOT NULL, "barber_id" uuid NOT NULL, "service_id" uuid NOT NULL, "start_time" TIMESTAMP WITH TIME ZONE NOT NULL, "end_time" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."bookings_status_enum" NOT NULL DEFAULT 'pending', "total_price" decimal(10,2) NOT NULL, CONSTRAINT "PK_bee68559d3d41e0809e7c9fd540" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_start_time_bookings" ON "bookings" ("start_time") `);

        await queryRunner.query(`CREATE TABLE "queue_entries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "client_id" uuid NOT NULL, "barber_id" uuid, "position" integer NOT NULL, "status" "public"."queue_entries_status_enum" NOT NULL DEFAULT 'waiting', "estimated_wait_minutes" integer NOT NULL DEFAULT 0, "joined_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_761016668740f90786967733276" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_joined_at_queue" ON "queue_entries" ("joined_at") `);

        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "client_id" uuid NOT NULL, "type" "public"."notifications_type_enum" NOT NULL, "message" text NOT NULL, "scheduled_at" TIMESTAMP WITH TIME ZONE NOT NULL, "sent_at" TIMESTAMP WITH TIME ZONE, "status" "public"."notifications_status_enum" NOT NULL DEFAULT 'scheduled', "provider_response" jsonb, CONSTRAINT "PK_6a7258da0f5786c451fa8e6fd80" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_scheduled_at_notifications" ON "notifications" ("scheduled_at") `);

        await queryRunner.query(`CREATE TABLE "barber_specialties" ("barber_id" uuid NOT NULL, "service_id" uuid NOT NULL, CONSTRAINT "PK_barber_specialties" PRIMARY KEY ("barber_id", "service_id"))`);

        // Add Foreign Keys
        await queryRunner.query(`ALTER TABLE "barbers" ADD CONSTRAINT "FK_barbers_users" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_clients_users" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_bookings_clients" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_bookings_barbers" FOREIGN KEY ("barber_id") REFERENCES "barbers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_bookings_services" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "queue_entries" ADD CONSTRAINT "FK_queue_clients" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "queue_entries" ADD CONSTRAINT "FK_queue_barbers" FOREIGN KEY ("barber_id") REFERENCES "barbers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_notifications_clients" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "barber_specialties" ADD CONSTRAINT "FK_specialties_barber" FOREIGN KEY ("barber_id") REFERENCES "barbers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "barber_specialties" ADD CONSTRAINT "FK_specialties_service" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "barber_specialties"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "queue_entries"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TABLE "barbers"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."queue_entries_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."bookings_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }
}