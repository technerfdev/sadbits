import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Task } from 'src/task/entities/task.entity';

@ObjectType()
export class AssociatedTasks {
  @Field(() => Int, { defaultValue: 0 })
  total: number;

  @Field(() => [Task], { nullable: 'itemsAndList' })
  tasks?: Task[] | null;
}
