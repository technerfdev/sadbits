import { Field, InputType } from '@nestjs/graphql';
import { PriorityType } from '@prisma/client';

@InputType()
export class FilterTaskInput {
  @Field(() => Boolean, { nullable: true })
  completed?: boolean;

  @Field(() => String, { nullable: true })
  priority?: PriorityType;
}
