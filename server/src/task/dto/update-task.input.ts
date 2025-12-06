import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateTaskInputDto } from './create-task.input';

@InputType()
export class UpdateTaskInput extends PartialType(CreateTaskInputDto) {
  @Field()
  @IsUUID('4')
  id: string;
}
