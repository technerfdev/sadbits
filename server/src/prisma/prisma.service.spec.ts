import { Test, TestingModule } from '@nestjs/testing';
import { PrismaServices } from './prisma.service';

describe('Prisma Service', () => {
  let service: PrismaServices;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaServices],
    }).compile();

    service = module.get<PrismaServices>(PrismaServices);
  });
  it('Prisma Service should be defined', () => {
    expect(service).toBeDefined();
  });
});
