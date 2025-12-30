import { Module } from '@nestjs/common';
import { ProjectsResolver } from './projects.resolver';
import { ProjectsService } from './projects.service';
import { PrismaServices } from '../prisma/prisma.service';
import { TaskModule } from 'src/task/task.module';
import { TaskService } from 'src/task/task.service';

@Module({
  imports: [TaskModule],
  providers: [ProjectsResolver, ProjectsService, PrismaServices, TaskService],
})
export class ProjectsModule {}
