import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CreateTaskInputDto } from './dto/create-task.input';
import { DeleteTaskResponse } from './dto/delete-task-response.dto';
import { UpdateTaskInput } from './dto/update-task.input';
import { Task } from './entities/task.entity';
import { TaskService } from './task.service';
import { FilterBy } from 'src/common/dto/filter-by.dto';

@Resolver(() => Task)
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Mutation(() => Task)
  createTask(@Args('task') data: CreateTaskInputDto) {
    return this.taskService.create(data);
  }

  @Query(() => Task)
  task(@Args('id', { type: () => ID }) id: string) {
    return this.taskService.task(id);
  }

  @Query(() => [Task])
  tasks(
    @Args('filterBy', {
      nullable: true,
      defaultValue: {
        completed: false,
        archived: false,
      },
    })
    filterBy?: FilterBy,
  ) {
    return this.taskService.getAll(filterBy);
  }

  @Mutation(() => DeleteTaskResponse)
  deleteTask(@Args('id', { type: () => ID }) id: string) {
    return this.taskService.softDeleteTask(id);
  }

  @Mutation(() => Task)
  updateTask(
    @Args('task', { type: () => UpdateTaskInput }) task: UpdateTaskInput,
  ) {
    return this.taskService.updateTask(task);
  }
}
