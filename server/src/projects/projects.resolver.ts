import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { CreateProjectInput } from './dto/project-input.dto';
import { Project } from './entities/project.entity';
import { UpdateProjectInput } from './dto/update-project-input.dto';
import { DeleteProject } from './dto/delete-project.dto';

@Resolver()
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query(() => [Project])
  projects() {
    return this.projectsService.getAll();
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
}
