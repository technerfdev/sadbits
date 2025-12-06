import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskResolver } from './task.resolver';
import { PrismaServices } from 'src/prisma/prisma.service';

@Module({
  providers: [TaskResolver, TaskService, PrismaServices],
})
export class TaskModule {}
