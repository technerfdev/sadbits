#!/usr/bin/env ts-node

// TODO: Fix bug when create relational

// error: Type "projects" is neither a built-in type, nor refers to another model, composite type, or enum. Did you mean "Projects"?
//   -->  src/prisma/schema.prisma:24
//    |
// 23 |   projectId  String?       @db.Uuid @map("project_id")
// 24 |   projects    projects?     @relation(fields: [project_id], references: [id], onDelete: NoAction, onUpdate: NoAction)

/**
 * This script automatically converts snake_case field names and table names in your Prisma schema to camelCase
 * while preserving the original database names using `@map` attributes.
 */

import * as fs from 'fs';
import * as path from 'path';

const SCHEMA_PATH = path.join(__dirname, '../src/prisma/schema.prisma');
/**
 * Convert snake_case to camelCase
 */
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Check if a field name is in snake_case
 */
function isSnakeCase(str: string): boolean {
  return str.includes('_');
}

/**
 * Check if a model/enum name should be transformed
 */
function shouldTransformModelName(str: string): boolean {
  return str.includes('_') || /^[a-z]/.test(str); // snake_case or starts with lowercase
}

/**
 * Convert to PascalCase (for model/enum names)
 */
function toPascalCase(str: string): string {
  return toCamelCase(str).replace(/^./, (c) => c.toUpperCase());
}

/**
 * Transform Prisma schema to add @map attributes for snake_case fields and models
 */
function transformSchema(schemaContent: string): string {
  const lines = schemaContent.split('\n');
  const transformedLines: string[] = [];
  let inModel = false;
  let inEnum = false;
  let currentModelName = '';
  let currentEnumName = '';
  const enumRenames = new Map<string, string>(); // Track enum renames

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('model ')) {
      inModel = true;
      const modelMatch = trimmedLine.match(/model\s+(\w+)\s*{/);
      if (modelMatch) {
        currentModelName = modelMatch[1];

        if (shouldTransformModelName(currentModelName)) {
          const camelModelName = toPascalCase(currentModelName);
          transformedLines.push(line.replace(currentModelName, camelModelName));
          continue;
        }
      }
    }

    if (trimmedLine.startsWith('enum ')) {
      inEnum = true;
      const enumMatch = trimmedLine.match(/enum\s+(\w+)\s*{/);
      if (enumMatch) {
        currentEnumName = enumMatch[1];

        if (shouldTransformModelName(currentEnumName)) {
          const camelEnumName = toPascalCase(currentEnumName);
          enumRenames.set(currentEnumName, camelEnumName); // Track the rename
          transformedLines.push(line.replace(currentEnumName, camelEnumName));
          continue;
        }
      }
    }

    if (trimmedLine === '}') {
      if (
        inModel &&
        currentModelName &&
        shouldTransformModelName(currentModelName)
      ) {
        const indent = line.match(/^\s*/)?.[0] || '';
        transformedLines.push(`${indent}@@map("${currentModelName}")`);
        transformedLines.push(line);
        inModel = false;
        currentModelName = '';
        continue;
      }

      if (
        inEnum &&
        currentEnumName &&
        shouldTransformModelName(currentEnumName)
      ) {
        const indent = line.match(/^\s*/)?.[0] || '';
        transformedLines.push(`${indent}@@map("${currentEnumName}")`);
        transformedLines.push(line);
        inEnum = false;
        currentEnumName = '';
        continue;
      }

      inModel = false;
      inEnum = false;
    }

    if (
      inModel &&
      trimmedLine &&
      !trimmedLine.startsWith('//') &&
      !trimmedLine.startsWith('@@')
    ) {
      const fieldMatch = line.match(/^(\s*)(\w+)(\s+)(\S+)(.*)/);

      if (fieldMatch) {
        const [, indent, fieldName, spacing, fieldType, rest] = fieldMatch;

        let updatedFieldType = fieldType;
        for (const [oldEnum, newEnum] of enumRenames) {
          updatedFieldType = updatedFieldType.replace(
            new RegExp(`\\b${oldEnum}\\b`),
            newEnum,
          );
        }

        if (!rest.includes('@map') && isSnakeCase(fieldName)) {
          const camelFieldName = toCamelCase(fieldName);

          const newLine = `${indent}${camelFieldName}${spacing}${updatedFieldType}${rest.trimEnd()} @map("${fieldName}")`;
          transformedLines.push(newLine);
          continue;
        }

        if (updatedFieldType !== fieldType) {
          const newLine = `${indent}${fieldName}${spacing}${updatedFieldType}${rest}`;
          transformedLines.push(newLine);
          continue;
        }
      }
    }

    transformedLines.push(line);
  }

  return transformedLines.join('\n');
}

function main() {
  try {
    console.log('Reading schema.prisma...');
    const schemaContent = fs.readFileSync(SCHEMA_PATH, 'utf-8');
    console.log('Transforming schema...');
    const transformedSchema = transformSchema(schemaContent);
    fs.writeFileSync(SCHEMA_PATH, transformedSchema, 'utf-8');
    console.log('Schema transformation complete!');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
