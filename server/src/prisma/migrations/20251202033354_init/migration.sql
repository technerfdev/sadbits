-- CreateEnum
CREATE TYPE "priority_type" AS ENUM ('low', 'medium', 'high');

-- CreateTable
CREATE TABLE "tasks" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "due_date" TIMESTAMP(6),
    "priority" "priority_type",
    "created_at" TIMESTAMP(6),
    "created_by" UUID,
    "updated_at" TIMESTAMP(6),
    "updated_by" UUID,
    "assigned_to" UUID[],
    "author" UUID,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "avatar" VARCHAR(500),
    "created_at" TIMESTAMPTZ(6)
);

-- CreateIndex
CREATE INDEX "idx_tasks_completed" ON "tasks"("completed");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
