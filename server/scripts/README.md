# Prisma CamelCase Transformation Script

This script automatically converts snake_case field names and table names in your Prisma schema to camelCase while preserving the original database names using `@map` attributes.

## Problem It Solves

When you run `npx prisma db pull` from an existing database with snake_case naming:
- Field names like `created_at`, `due_date`, `updated_by` are pulled as-is
- You'd need to manually add `@map` attributes to use camelCase in your code
- This is tedious and error-prone for large schemas

## What It Does

The script automatically:
1. Converts snake_case field names to camelCase
2. Adds `@map("original_name")` attributes
3. Converts snake_case table/enum names to PascalCase
4. Adds `@@map("original_name")` for models and enums

## Usage

### Option 1: Automatic (Recommended)
```bash
npm run prisma:pull
```

This will:
1. Pull the latest schema from your database
2. Automatically apply camelCase transformations
3. Generate the Prisma client

### Option 2: Manual
```bash
# Pull schema from database
npx prisma db pull

# Apply camelCase transformation
npm run prisma:camelcase

# Generate Prisma client
npx prisma generate
```

### Option 3: Run script directly
```bash
ts-node scripts/prisma-camelcase.ts
```

## Example Transformation

### Before (after `prisma db pull`)
```prisma
model tasks {
  id          String    @id @db.Uuid
  title       String    @db.VarChar(255)
  due_date    DateTime? @db.Timestamp(6)
  created_at  DateTime? @db.Timestamp(6)
  updated_by  String?   @db.Uuid
}

enum priority_type {
  low
  medium
  high
}
```

### After (running the script)
```prisma
model Tasks {
  id         String    @id @db.Uuid
  title      String    @db.VarChar(255)
  dueDate    DateTime? @map("due_date") @db.Timestamp(6)
  createdAt  DateTime? @map("created_at") @db.Timestamp(6)
  updatedBy  String?   @map("updated_by") @db.Uuid

  @@map("tasks")
}

enum PriorityType {
  low
  medium
  high

  @@map("priority_type")
}
```

## Benefits

✅ **Consistent Code Style**: Use camelCase in TypeScript/JavaScript code
✅ **Database Compatibility**: Keep snake_case in database
✅ **No Manual Work**: Automatic transformation after pulls
✅ **Safe**: Preserves original schema structure
✅ **Reversible**: Original names preserved in `@map` attributes

## How It Works

1. **Reads** `src/prisma/schema.prisma`
2. **Identifies** snake_case field and model names
3. **Converts** to camelCase (fields) or PascalCase (models/enums)
4. **Adds** `@map` or `@@map` attributes with original names
5. **Writes** back to the schema file

## TypeScript Usage After Transformation

```typescript
// Before: Using snake_case
const task = await prisma.tasks.create({
  data: {
    title: 'My Task',
    due_date: new Date(),
    created_at: new Date(),
  },
});

// After: Using camelCase
const task = await prisma.tasks.create({
  data: {
    title: 'My Task',
    dueDate: new Date(),  // ✅ camelCase
    createdAt: new Date(), // ✅ camelCase
  },
});
```

## Edge Cases Handled

- ✅ Preserves existing `@map` attributes
- ✅ Skips fields already in camelCase
- ✅ Handles multi-word snake_case: `user_first_name` → `userFirstName`
- ✅ Preserves comments and formatting
- ✅ Works with indexes, relations, and constraints

## Workflow Integration

### Typical Development Flow

```bash
# 1. Make database changes (add new table/column)
# 2. Pull changes and auto-transform
npm run prisma:pull

# 3. Review changes in schema.prisma
git diff src/prisma/schema.prisma

# 4. Update your TypeScript code to use camelCase
# 5. Commit changes
git add src/prisma/schema.prisma
git commit -m "feat: add new table with camelCase mapping"
```

### CI/CD Integration

Add to your CI pipeline:
```yaml
- name: Pull and transform Prisma schema
  run: npm run prisma:pull

- name: Verify schema changes
  run: git diff --exit-code src/prisma/schema.prisma || echo "Schema updated"
```

## Troubleshooting

### Script doesn't transform a field
- Check if the field already has `@map` attribute
- Ensure the field name contains underscores
- Verify the field is inside a `model` block

### Generated client still uses snake_case
- Run `npx prisma generate` after transformation
- Check that `@map` attributes were added correctly
- Restart your TypeScript server

### Want to exclude specific fields from transformation
Edit the script and add to the skip conditions:
```typescript
const SKIP_FIELDS = ['id', 'created_at']; // Example: keep these as-is

if (SKIP_FIELDS.includes(fieldName)) {
  transformedLines.push(line);
  continue;
}
```

## Advanced: Custom Transformation Rules

You can modify `scripts/prisma-camelcase.ts` to add custom rules:

```typescript
// Example: Custom prefix handling
function toCamelCase(str: string): string {
  // Remove 'tbl_' prefix before converting
  str = str.replace(/^tbl_/, '');

  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}
```

## Files Modified

- `src/prisma/schema.prisma` - Your Prisma schema file
- No other files are touched by this script

## Safety

- ✅ **Non-destructive**: Only modifies schema.prisma
- ✅ **Idempotent**: Safe to run multiple times
- ✅ **Version controlled**: Changes visible in git diff
- ✅ **Reversible**: Can manually remove `@map` if needed

## Contributing

To improve the script:
1. Edit `scripts/prisma-camelcase.ts`
2. Test with `npm run prisma:camelcase`
3. Verify output in `src/prisma/schema.prisma`

## Related Commands

```bash
# Just pull schema (no transformation)
npx prisma db pull

# Just run transformation (no pull)
npm run prisma:camelcase

# Generate client only
npx prisma generate

# Full workflow (pull + transform + generate)
npm run prisma:pull
```
