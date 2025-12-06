import { Query, Resolver } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';

@Resolver()
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query(() => String)
  projects() {
    return this.projectsService.getAll();
  }
}
