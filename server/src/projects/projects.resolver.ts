import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { CreateProjectInput } from './dto/project-input.dto';
import { Project } from './entities/project.entity';

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
}
