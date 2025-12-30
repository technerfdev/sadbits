import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Task } from 'src/task/entities/task.entity';
import { AssociatedTasks } from '../dto/associated-tasks.dto';

@ObjectType()
export class Project {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => Date)
  created_at?: Date;

  @Field(() => AssociatedTasks, { nullable: true })
  associatedTasks?: AssociatedTasks;
}
