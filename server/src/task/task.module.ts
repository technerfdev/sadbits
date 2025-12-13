import { Module } from '@nestjs/common';
import { PrismaServices } from 'src/prisma/prisma.service';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';

@Module({
  providers: [TaskResolver, TaskService, PrismaServices],
})
export class TaskModule {}
