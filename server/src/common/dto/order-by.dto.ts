import { Field, InputType } from '@nestjs/graphql';

type Direction = 'asc' | 'desc';

@InputType()
export class OrderBy {
  @Field(() => String)
  field: string;

  @Field(() => String)
  direction: Direction;
}
