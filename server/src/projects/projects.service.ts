import { Injectable } from '@nestjs/common';
import { PrismaServices } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaServices) {}

  getAll() {
    return 'All';
  }

  create() {
    return 'hello';
  }
}
