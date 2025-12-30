import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean } from 'class-validator';

@ObjectType()
export class DeleteProject {
  @Field(() => Boolean)
  @IsBoolean()
  success: boolean;
}
