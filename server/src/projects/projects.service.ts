import { Injectable } from '@nestjs/common';
import { PrismaServices } from 'src/prisma/prisma.service';
import { CreateProjectInput } from './dto/project-input.dto';
import { v4 as uuidv4 } from 'uuid';
import { UTCDate } from '@date-fns/utc';

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
}
