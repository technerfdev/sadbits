import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ProjectFilterBy {
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  archived?: boolean;

  @Field(() => String, { nullable: true })
  search?: string;
}
