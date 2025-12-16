import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';

const mockPrismaService = {
  projects: {
    getAll: jest.fn(),
  },
};

jest.mock('uuid', () => ({
  v4: () => '00000000-0000-0000-0000-000000000000',
}));

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: ProjectsService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
