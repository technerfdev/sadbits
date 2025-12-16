import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateProjectInput } from './project-input.dto';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateProjectInput extends PartialType(CreateProjectInput) {
  @Field(() => String)
  @IsUUID()
  id: string;
}
