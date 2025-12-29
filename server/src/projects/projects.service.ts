import { UTCDate } from '@date-fns/utc';
import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaServices } from '../prisma/prisma.service';
import { CreateProjectInput } from './dto/project-input.dto';
import { UpdateProjectInput } from './dto/update-project-input.dto';
import { FilterBy } from 'src/common/dto/filter-by.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaServices) {}

  getAll() {
    return this.prisma.projects.findMany();
  }

  create(input: CreateProjectInput) {
    return this.prisma.projects.create({
      data: { id: uuidv4(), ...input, createdAt: new UTCDate() },
    });
  }

  async update(input: UpdateProjectInput) {
    const existing = await this.prisma.projects.findUnique({
      where: {
        id: input.id,
      },
    });

    return this.prisma.projects.update({
      where: {
        id: existing?.id,
      },
      data: { ...input },
    });
  }

  async duplicate(projectId: string) {
    const existing = await this.prisma.projects.findUnique({
      where: {
        id: projectId,
      },
    });
    if (!existing) {
      throw new NotFoundException(`Project not found`);
    }
    return this.prisma.projects.create({
      data: {
        id: uuidv4(),
        name: existing.name + '(copy)',
        description: existing.description,
        createdAt: new UTCDate(),
      },
    });
  }

  getTasks(projectId: string, filterBy: Omit<FilterBy, 'projectId'>) {
    return this.prisma.tasks.findMany({
      where: {
        ...filterBy,
        projectId: projectId,
      },
    });
  }
}
