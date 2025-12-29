import { UTCDate } from '@date-fns/utc';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterBy } from 'src/common/dto/filter-by.dto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaServices } from '../prisma/prisma.service';
import { CreateTaskInputDto } from './dto/create-task.input';
import { DeleteTaskResponse } from './dto/delete-task-response.dto';
import { UpdateTaskInput } from './dto/update-task.input';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaServices) {}

  private async isExisting(id: string): Promise<boolean> {
    const existing = await this.prisma.tasks.findUnique({
      where: {
        id,
        archived: false,
      },
    });

    return Boolean(existing?.id);
  }

  create(data: CreateTaskInputDto): Promise<Task> {
    return this.prisma.tasks.create({
      data: {
        id: uuidv4(),
        ...data,
        createdAt: new UTCDate(),
      },
    });
  }

  async task(id: string): Promise<Task | null> {
    const task = await this.prisma.tasks.findUnique({
      where: {
        id,
        archived: false,
      },
    });

    if (!task) {
      throw new NotFoundException({
        message: 'Task not found',
        error: 'TaskNotFound',
      });
    }

    let project = null;
    if (task?.projectId) {
      project = await this.prisma.projects.findUnique({
        where: { id: task?.projectId },
      });
    }
    return {
      ...task,
      ...(project ? { project: { id: project.id, name: project.name } } : {}),
    };
  }

  getAll(filterBy?: FilterBy): Promise<Task[] | null> {
    return this.prisma.tasks.findMany({
      where: {
        ...filterBy,
      },
      include: {
        projects: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      orderBy: [{ dueDate: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async softDeleteTask(id: string): Promise<DeleteTaskResponse> {
    const existing = await this.isExisting(id);

    if (!existing) {
      throw new NotFoundException({
        message: 'Task not found',
        error: 'TaskNotFound',
      });
    }

    await this.prisma.tasks.update({
      where: { id },
      data: {
        archived: true,
      },
    });

    return { success: true };
  }

  async updateTask(task: UpdateTaskInput): Promise<Task> {
    const isExisting = await this.isExisting(task.id);

    if (!isExisting) {
      throw new NotFoundException({
        message: 'Task not found',
        error: 'TaskNotFound',
      });
    }

    const updated = await this.prisma.tasks.update({
      where: { id: task.id },
      data: {
        ...task,
        updatedAt: new UTCDate(),
      },
    });

    return updated;
  }

  async getAllDone(): Promise<Task[] | null> {
    const raw = await this.prisma.tasks.findMany({
      where: {
        completed: true,
      },
      orderBy: [{ dueDate: 'desc' }, { createdAt: 'asc' }],
    });

    if (!raw.length) {
      return null;
    }
    return raw;
  }
}
