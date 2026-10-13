import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "repository_activity_recent_commits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"sha" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"committed_at" timestamp(3) with time zone,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "repository_activity" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"work_id" integer NOT NULL,
  	"repository" varchar NOT NULL,
  	"last_commit_at" timestamp(3) with time zone,
  	"commits_last30_days" numeric DEFAULT 0,
  	"latest_release_name" varchar,
  	"latest_release_url" varchar,
  	"latest_release_published_at" timestamp(3) with time zone,
  	"synced_at" timestamp(3) with time zone NOT NULL,
  	"sync_error" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "repository_activity_id" integer;
  ALTER TABLE "repository_activity_recent_commits" ADD CONSTRAINT "repository_activity_recent_commits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."repository_activity"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "repository_activity" ADD CONSTRAINT "repository_activity_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "repository_activity_recent_commits_order_idx" ON "repository_activity_recent_commits" USING btree ("_order");
  CREATE INDEX "repository_activity_recent_commits_parent_id_idx" ON "repository_activity_recent_commits" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "repository_activity_work_idx" ON "repository_activity" USING btree ("work_id");
  CREATE INDEX "repository_activity_updated_at_idx" ON "repository_activity" USING btree ("updated_at");
  CREATE INDEX "repository_activity_created_at_idx" ON "repository_activity" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_repository_activity_fk" FOREIGN KEY ("repository_activity_id") REFERENCES "public"."repository_activity"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_repository_activity_id_idx" ON "payload_locked_documents_rels" USING btree ("repository_activity_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "repository_activity_recent_commits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "repository_activity" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "repository_activity_recent_commits" CASCADE;
  DROP TABLE "repository_activity" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_repository_activity_fk";
  
  DROP INDEX "payload_locked_documents_rels_repository_activity_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "repository_activity_id";`)
}
