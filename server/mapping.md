# Database Field Mapping Guide

This document explains how we handle the mismatch between TypeScript naming conventions (camelCase) and PostgreSQL naming conventions (snake_case) using Prisma.

## Our Approach: Prisma Migrations with @map Attributes

We use Prisma's `@map` and `@@map` attributes to maintain clean TypeScript code while keeping PostgreSQL conventions in the database.

## Naming Conventions

- **Models:** PascalCase in Prisma ’ snake_case in PostgreSQL
  - `Task` ’ `tasks` table
  - `User` ’ `users` table
  - `PriorityType` ’ `priority_type` enum

- **Fields:** camelCase in Prisma ’ snake_case in PostgreSQL
  - `dueDate` ’ `due_date` column
  - `createdAt` ’ `created_at` column
  - `firstName` ’ `first_name` column

## Schema Example

```prisma
model Task {
  id          String        @id @db.Uuid
  title       String        @db.VarChar(255)
  dueDate     DateTime?     @map("due_date") @db.Timestamp(6)
  createdAt   DateTime?     @map("created_at") @db.Timestamp(6)
  assignedTo  String[]      @map("assigned_to") @db.Uuid

  @@map("tasks")  // Maps to 'tasks' table in PostgreSQL
}

enum PriorityType {
  low
  medium
  high

  @@map("priority_type")  // Maps to 'priority_type' enum in PostgreSQL
}
```

## TypeScript Usage

With `@map` attributes, you use clean camelCase throughout your TypeScript code:

```typescript
// Service layer
async createTask(input: CreateTaskInput) {
  return this.prisma.task.create({
    data: {
      title: input.title,
      dueDate: input.dueDate,        // camelCase in TS
      createdAt: new Date(),
      assignedTo: input.assignedTo,
    }
  });
}

// GraphQL resolvers
@Query(() => [Task])
async tasks() {
  return this.taskService.findAll();  // Returns objects with camelCase fields
}
```

## Database Schema

PostgreSQL automatically uses snake_case:

```sql
-- The actual table in PostgreSQL
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  due_date TIMESTAMP(6),           -- snake_case in DB
  created_at TIMESTAMP(6),
  assigned_to UUID[]
);
```

## Workflow: Making Schema Changes

###   IMPORTANT: Never Use `prisma db pull`

Using `prisma db pull` will overwrite your `@map` attributes and revert everything to snake_case. We use migrations instead.

### Step 1: Edit Schema

Edit `prisma/schema.prisma` with proper naming:

```prisma
model Task {
  // ... existing fields
  projectId String? @map("project_id") @db.Uuid  // Always add @map for new fields
}
```

### Step 2: Create Migration

```bash
cd server
npx prisma migrate dev --name add_project_id
```

This will:
1. Generate SQL migration in `prisma/migrations/`
2. Apply it to your database
3. Regenerate Prisma Client with updated types

### Step 3: Use in Code

```typescript
// Immediately available with camelCase
await prisma.task.update({
  where: { id },
  data: { projectId: 'some-uuid' }  // camelCase!
});
```

## Common Operations

### Adding a New Model

```prisma
model Project {
  id        String   @id @default(uuid()) @db.Uuid
  name      String   @db.VarChar(255)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("projects")  // Don't forget this!
}
```

```bash
npx prisma migrate dev --name add_projects_table
```

### Adding a New Field

```prisma
model Task {
  // ... existing fields
  estimatedHours Int? @map("estimated_hours")
}
```

```bash
npx prisma migrate dev --name add_estimated_hours
```

### Renaming a Field (In Code Only)

If you want to rename in TypeScript but keep DB column name:

```prisma
model Task {
  // Before:
  // author String? @map("author") @db.Uuid

  // After (no DB change, just better TS naming):
  authorId String? @map("author") @db.Uuid
}
```

```bash
npx prisma migrate dev --name rename_author_field
# This will generate an empty migration (no DB changes)
```

### Adding a Relation

```prisma
model Task {
  // ... existing fields
  projectId String?  @map("project_id") @db.Uuid
  project   Project? @relation(fields: [projectId], references: [id])
}

model Project {
  id    String @id @default(uuid()) @db.Uuid
  tasks Task[]

  @@map("projects")
}
```

```bash
npx prisma migrate dev --name add_task_project_relation
```

## Initial Setup (For New Developers)

If you're setting up the project for the first time:

```bash
cd server

# 1. Install dependencies
pnpm install

# 2. Create .env file with DATABASE_URL
cp .env.example .env

# 3. Apply all existing migrations
npx prisma migrate deploy

# 4. Generate Prisma Client
npx prisma generate

# 5. (Optional) Seed database
npx prisma db seed
```

## Migration Best Practices

###  DO:
- Always add `@map("snake_case")` for fields that don't match camelCase
- Always add `@@map("table_name")` for models
- Version control your migrations (`git add prisma/migrations/`)
- Write descriptive migration names: `add_user_preferences`, `rename_task_status`
- Review generated SQL before applying with `--create-only` flag

### L DON'T:
- Never run `prisma db pull` (it will remove all @map attributes)
- Never edit migration files after they're applied
- Never delete migrations that have been deployed to production
- Never manually edit the database without creating a migration

## Troubleshooting

### "Migration is already applied"

```bash
# Mark migration as applied without running it
npx prisma migrate resolve --applied migration_name
```

### "Database schema is not in sync"

```bash
# Create a new migration to sync
npx prisma migrate dev --name sync_schema
```

### Need to reset development database?

```bash
#   This deletes all data!
npx prisma migrate reset
```

### TypeScript errors after schema change?

```bash
# Regenerate Prisma Client
npx prisma generate

# Restart your NestJS server
pnpm run start:dev
```

## Team Workflow

### Developer A Makes Changes:

```bash
# 1. Edit schema
vim prisma/schema.prisma

# 2. Create migration
npx prisma migrate dev --name add_feature

# 3. Commit
git add prisma/
git commit -m "feat: add new feature to schema"
git push
```

### Developer B Pulls Changes:

```bash
# 1. Pull latest code
git pull

# 2. Apply new migrations
npx prisma migrate deploy

# 3. Regenerate client (usually automatic, but just in case)
npx prisma generate

# 4. Restart dev server
pnpm run start:dev
```

## CI/CD Integration

In your deployment pipeline:

```bash
# Before starting the application
cd server
npx prisma migrate deploy  # Apply all pending migrations
npx prisma generate        # Ensure client is up to date
pnpm run build             # Build application
pnpm run start:prod        # Start server
```

## Why This Approach?

**Pros:**
-  Clean TypeScript code with camelCase throughout
-  Database follows PostgreSQL conventions
-  Version-controlled schema changes
-  Type-safe database access
-  No runtime overhead
-  Team can collaborate safely on schema changes

**Cons:**
-   Must manually update schema (can't use `db pull`)
-   Need to remember `@map` attributes for new fields
-   Requires discipline from team members

## Related Documentation

- Prisma Migrations: https://www.prisma.io/docs/concepts/components/prisma-migrate
- Prisma Schema: https://www.prisma.io/docs/concepts/components/prisma-schema
- NestJS with Prisma: https://docs.nestjs.com/recipes/prisma
- Project Architecture: [../architecture.md](./architecture.md)
