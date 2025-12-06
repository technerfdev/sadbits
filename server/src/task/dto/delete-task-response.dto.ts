import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteTaskResponse {
  @Field()
  success: boolean;
}
