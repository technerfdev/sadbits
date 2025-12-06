import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PriorityType } from '@prisma/client';

export enum PriorityTypeTaskPriority {
  LOW = 'low',
  MED = 'MEDIUM',
  HIGH = 'HIGH',
}

@ObjectType()
export class Task {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => PriorityType, { nullable: true })
  priority: PriorityType | null;

  @Field(() => Date, { nullable: true })
  dueDate: Date | null;

  @Field(() => Boolean)
  completed: boolean;

  @Field(() => Date, { nullable: true })
  createdAt: Date | null;

  @Field(() => Date, { nullable: true })
  updatedAt: Date | null;

  @Field(() => String, { nullable: true })
  author: string | null;

  @Field(() => Boolean, { nullable: true })
  archived: boolean | null;
}
