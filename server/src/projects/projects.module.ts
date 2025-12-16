import { Module } from '@nestjs/common';
import { ProjectsResolver } from './projects.resolver';
import { ProjectsService } from './projects.service';
import { PrismaServices } from '../prisma/prisma.service';

@Module({
  providers: [ProjectsResolver, ProjectsService, PrismaServices],
})
export class ProjectsModule {}
