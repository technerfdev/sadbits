import { UTCDate } from '@date-fns/utc';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderBy } from 'src/common/dto/order-by.dto';
import { validate as isValidUUID, v4 as uuidv4 } from 'uuid';
import { PrismaServices } from '../prisma/prisma.service';
import { ProjectFilterBy } from './dto/project-filterby.dto';
import { CreateProjectInput } from './dto/project-input.dto';
import { UpdateProjectInput } from './dto/update-project-input.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaServices) {}

  getAll({
    filterBy,
    orderBy,
  }: {
    filterBy?: ProjectFilterBy;
    orderBy?: OrderBy;
  }) {
    return this.prisma.projects.findMany({
      where: {
        ...filterBy,
        archived: filterBy?.archived ?? false,
      },
      include: {
        tasks: true,
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
        ...(orderBy
          ? [
              {
                [orderBy.field]: orderBy.direction,
              },
            ]
          : []),
      ],
    });
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

  async delete(projectId: string) {
    if (!projectId || projectId.trim() === '' || !isValidUUID(projectId)) {
      throw new BadRequestException('Project ID is invalid');
    }

    const existing = await this.prisma.projects.findUnique({
      where: { id: projectId },
    });

    if (!existing) {
      throw new NotFoundException('Project not found');
    }

    await this.prisma.projects.update({
      where: { id: projectId },
      data: { archived: true, updatedAt: new UTCDate() },
    });

    return { success: true };
  }
}
