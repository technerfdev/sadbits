import { Test, TestingModule } from '@nestjs/testing';
import { PriorityType } from '@prisma/client';
import { PrismaServices } from '../prisma/prisma.service';
import { TaskService } from './task.service';

const mockPrismaService = {
  tasks: {
    create: jest.fn(),
  },
};

jest.mock('uuid', () => ({
  v4: () => '00000000-0000-0000-0000-000000000000',
}));

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: PrismaServices, useValue: mockPrismaService },
      ],
    }).compile();
    service = module.get<TaskService>(TaskService);

    jest.clearAllMocks();
  });

  it('TaskService ', () => {
    expect(service).toBeDefined();
  });

  it('Create Task', async () => {
    const mock = {
      title: 'Mock task',
      description: 'Description of mock task',
      dueDate: new Date().toISOString(),
      priority: PriorityType.low,
    };

    const res = await service.create(mock);
    expect(res.id).toEqual('00000000-0000-0000-0000-000000000000');

    mockPrismaService.tasks.create.mockResolvedValue(mock);
    expect(mockPrismaService.tasks.create).toHaveBeenCalledTimes(1);
  });
});
