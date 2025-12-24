import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PriorityType, Tasks } from '@prisma/client';

export enum PriorityTypeTaskPriority {
  LOW = 'low',
  MED = 'MEDIUM',
  HIGH = 'HIGH',
}

@ObjectType()
export class Task implements Partial<Tasks> {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => Boolean)
  completed: boolean;

  @Field(() => Date, { nullable: true })
  dueDate: Date | null;

  @Field(() => PriorityType, { nullable: true })
  priority: PriorityType | null;

  @Field(() => Date, { nullable: true })
  createdAt: Date | null;

  @Field(() => String, { nullable: true })
  createdBy: string | null;

  @Field(() => Date, { nullable: true })
  updatedAt: Date | null;

  @Field(() => String, { nullable: true })
  updatedBy: string | null;

  @Field(() => [String], { nullable: true })
  assignedTo: string[];

  @Field(() => String, { nullable: true })
  author: string | null;

  @Field(() => String, { nullable: true })
  projectId: string | null;

  @Field(() => Boolean, { nullable: true })
  archived: boolean | null;
}
