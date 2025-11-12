import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1731244716000 implements MigrationInterface {
    name = 'InitialSchema1731244716000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create UUID extension
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Create ENUM types
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN','STAFF','CUSTOMER')`);
        await queryRunner.query(`CREATE TYPE "public"."employees_status_enum" AS ENUM('WORKING','ON_LEAVE','RESIGNED')`);
        await queryRunner.query(`CREATE TYPE "public"."categories_moduletype_enum" AS ENUM('SERVICE','ARTICLE','LISTING')`);
        await queryRunner.query(`CREATE TYPE "public"."listings_status_enum" AS ENUM('PENDING','APPROVED','REJECTED')`);
        await queryRunner.query(`CREATE TYPE "public"."fee_types_calculationmethod_enum" AS ENUM('FIXED','PERCENT','VALUE_BASED','TIERED','FORMULA')`);
        await queryRunner.query(`CREATE TYPE "public"."records_status_enum" AS ENUM('PENDING','APPROVED','REJECTED')`);
        await queryRunner.query(`CREATE TYPE "public"."articles_status_enum" AS ENUM('DRAFT','PUBLISHED','ARCHIVED','HIDDEN')`);
        await queryRunner.query(`CREATE TYPE "public"."articles_type_enum" AS ENUM('NEWS','SHARE','INTERNAL')`);
        await queryRunner.query(`CREATE TYPE "public"."email_campaigns_eventtype_enum" AS ENUM('BIRTHDAY','HOLIDAY','ANNIVERSARY','OTHER')`);
        await queryRunner.query(`CREATE TYPE "public"."chat_messages_sender_enum" AS ENUM('USER','BOT','AGENT')`);
        await queryRunner.query(`CREATE TYPE "public"."chat_sessions_status_enum" AS ENUM('ACTIVE','CLOSED','ESCALATED')`);
        await queryRunner.query(`CREATE TYPE "public"."consultations_status_enum" AS ENUM('PENDING','APPROVED','COMPLETED','CANCELLED')`);

        // Create tables
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "fullName" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "phone" character varying NOT NULL,
                "dateOfBirth" date NOT NULL,
                "role" "public"."users_role_enum" NOT NULL DEFAULT 'CUSTOMER',
                "status" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "employees" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "position" character varying NOT NULL,
                "email" character varying NOT NULL,
                "phone" character varying NOT NULL,
                "yearsOfExperience" integer NOT NULL DEFAULT '0',
                "dateOfBirth" date,
                "status" "public"."employees_status_enum" NOT NULL DEFAULT 'WORKING',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_765bc1ac8967533a04c74a9f6af" UNIQUE ("email"),
                CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "categories" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "description" text,
                "moduleType" "public"."categories_moduletype_enum" NOT NULL DEFAULT 'SERVICE',
                "status" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"),
                CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "services" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "description" text NOT NULL,
                "price" numeric(10,2) NOT NULL,
                "categoryId" uuid,
                "status" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_02cf0d0f46e11d22d952f623670" UNIQUE ("slug"),
                CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "document_groups" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "description" text,
                "formFields" jsonb,
                "status" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_2385871ee16e55555979113585c" UNIQUE ("slug"),
                CONSTRAINT "PK_1b039f0eabb77adb382a57d7191" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "fee_types" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "documentGroupId" uuid NOT NULL,
                "name" character varying NOT NULL,
                "calculationMethod" "public"."fee_types_calculationmethod_enum" NOT NULL DEFAULT 'FIXED',
                "formula" jsonb,
                "baseFee" numeric(15,2),
                "percentage" numeric(5,4),
                "minFee" numeric(15,2),
                "maxFee" numeric(15,2),
                "status" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_13c213789b6c9fc376303db1fb9" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "fee_calculations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid,
                "documentGroupId" uuid NOT NULL,
                "feeTypeId" uuid NOT NULL,
                "inputData" jsonb NOT NULL,
                "calculationResult" jsonb NOT NULL,
                "totalFee" numeric(15,2) NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_ced92c91f62cc77b54b7e0171ff" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "records" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "customerId" uuid NOT NULL,
                "typeId" uuid NOT NULL,
                "title" character varying(255) NOT NULL,
                "description" text,
                "attachments" jsonb,
                "status" "public"."records_status_enum" NOT NULL DEFAULT 'PENDING',
                "reviewNotes" text,
                "reviewerId" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_188149422ee2454660abf1d5ee5" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "articles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(255) NOT NULL,
                "slug" character varying(255) NOT NULL,
                "content" text NOT NULL,
                "authorId" uuid NOT NULL,
                "categoryId" uuid,
                "status" "public"."articles_status_enum" NOT NULL DEFAULT 'DRAFT',
                "type" "public"."articles_type_enum" NOT NULL DEFAULT 'NEWS',
                "isCrawled" boolean NOT NULL DEFAULT false,
                "sourceUrl" character varying(500),
                "approverId" uuid,
                "publishedAt" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_1123ff6815c5b8fec0ba9fec370" UNIQUE ("slug"),
                CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "listings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "authorId" uuid NOT NULL,
                "title" character varying(255) NOT NULL,
                "content" text NOT NULL,
                "price" numeric(15,2),
                "categoryId" uuid,
                "status" "public"."listings_status_enum" NOT NULL DEFAULT 'PENDING',
                "isHidden" boolean NOT NULL DEFAULT false,
                "approverId" uuid,
                "approvalNotes" text,
                "images" jsonb,
                "likeCount" integer NOT NULL DEFAULT '0',
                "commentCount" integer NOT NULL DEFAULT '0',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_520ecac6c99ec90bcf5a603cdcb" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "listing_comments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "listingId" uuid NOT NULL,
                "userId" uuid NOT NULL,
                "commentText" text NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_6a39118b4efa35b981aa31693d5" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "listing_likes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "listingId" uuid NOT NULL,
                "userId" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_db352749f430ae754f9fe5ad968" UNIQUE ("listingId", "userId"),
                CONSTRAINT "PK_fa97db96e57f9a4c32b7e0843cb" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "consultations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "customerId" uuid NOT NULL,
                "staffId" uuid,
                "serviceId" uuid,
                "requestedDatetime" TIMESTAMP NOT NULL,
                "content" text NOT NULL,
                "status" "public"."consultations_status_enum" NOT NULL DEFAULT 'PENDING',
                "cancelReason" text,
                "notes" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_c5b78e9424d9bc68464f6a12103" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "email_campaigns" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(255) NOT NULL,
                "eventType" "public"."email_campaigns_eventtype_enum" NOT NULL,
                "template" text NOT NULL,
                "subject" text,
                "schedule" jsonb,
                "recipientCriteria" jsonb,
                "status" boolean NOT NULL DEFAULT true,
                "lastSentAt" TIMESTAMP,
                "sentCount" integer NOT NULL DEFAULT '0',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_72bad329795785308e66d562350" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "chat_messages" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "sessionId" uuid NOT NULL,
                "sender" "public"."chat_messages_sender_enum" NOT NULL,
                "messageText" text NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "chat_sessions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid,
                "status" "public"."chat_sessions_status_enum" NOT NULL DEFAULT 'ACTIVE',
                "escalatedAt" TIMESTAMP,
                "startedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "endedAt" TIMESTAMP,
                CONSTRAINT "PK_efc151a4aafa9a28b73dedc485f" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop all tables
        await queryRunner.query(`DROP TABLE "chat_sessions"`);
        await queryRunner.query(`DROP TABLE "chat_messages"`);
        await queryRunner.query(`DROP TABLE "email_campaigns"`);
        await queryRunner.query(`DROP TABLE "consultations"`);
        await queryRunner.query(`DROP TABLE "listing_likes"`);
        await queryRunner.query(`DROP TABLE "listing_comments"`);
        await queryRunner.query(`DROP TABLE "listings"`);
        await queryRunner.query(`DROP TABLE "articles"`);
        await queryRunner.query(`DROP TABLE "records"`);
        await queryRunner.query(`DROP TABLE "fee_calculations"`);
        await queryRunner.query(`DROP TABLE "fee_types"`);
        await queryRunner.query(`DROP TABLE "document_groups"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "employees"`);
        await queryRunner.query(`DROP TABLE "users"`);

        // Drop ENUM types
        await queryRunner.query(`DROP TYPE "public"."consultations_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."chat_sessions_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."chat_messages_sender_enum"`);
        await queryRunner.query(`DROP TYPE "public"."email_campaigns_eventtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."articles_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."articles_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."records_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."fee_types_calculationmethod_enum"`);
        await queryRunner.query(`DROP TYPE "public"."listings_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."categories_moduletype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."employees_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }
}
