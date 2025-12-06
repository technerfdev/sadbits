import { InputType, Field } from '@nestjs/graphql';
import { PriorityType } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import '../enums/priority.enum';

@InputType()
export class CreateTaskInputDto {
  @Field(() => String)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => PriorityType, { nullable: true })
  @IsOptional()
  @IsEnum(PriorityType)
  priority?: PriorityType;

  @Field({ nullable: true })
  @IsDateString(
    {},
    {
      message:
        'Due date must be a valid ISO 8601 date string with time zone or UTC',
    },
  )
  createdAt?: string;

  @Field({ nullable: true })
  @IsString()
  createdBy?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        'Updated date must be a valid ISO 8601 date string with time zone or UTC',
    },
  )
  updatedAt?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID('4')
  updatedBy?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        'Due date must be a valid ISO 8601 date string with time zone or UTC',
    },
  )
  dueDate?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true, message: 'Each assigned user must be valid UUID' })
  assignedTo?: string[];
}
