import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { DeleteProject } from './dto/delete-project.dto';
import { ProjectFilterBy } from './dto/project-filterby.dto';
import { CreateProjectInput } from './dto/project-input.dto';
import { UpdateProjectInput } from './dto/update-project-input.dto';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';
import { AssociatedTasks } from './dto/associated-tasks.dto';
import { Task } from 'src/task/entities/task.entity';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query(() => [Project])
  projects(@Args('filterBy', { nullable: true }) filterBy?: ProjectFilterBy) {
    return this.projectsService.getAll({ filterBy });
  }

  @Mutation(() => Project)
  createProject(@Args('project') task: CreateProjectInput) {
    return this.projectsService.create(task);
  }

  @Mutation(() => Project)
  duplicateProject(@Args('projectId') id: string) {
    return this.projectsService.duplicate(id);
  }

  @Mutation(() => Project)
  updateProject(@Args('project') project: UpdateProjectInput) {
    return this.projectsService.update(project);
  }

  @Mutation(() => DeleteProject)
  async deleteProject(@Args('projectId') id: string) {
    return this.projectsService.delete(id);
  }

  @ResolveField(() => AssociatedTasks)
  associatedTasks(
    @Parent()
    project: {
      tasks: Task[];
      _count: {
        tasks: number;
      };
    },
  ) {
    const tasks = project.tasks ?? [];
    const total =
      project._count?.tasks ?? (Array.isArray(tasks) ? tasks.length : 0);
    return { total, tasks };
  }
}
