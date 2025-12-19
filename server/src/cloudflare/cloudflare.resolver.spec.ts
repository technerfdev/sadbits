import { Test, TestingModule } from '@nestjs/testing';
import { CloudflareResolver } from './cloudflare.resolver';

describe('CloudflareResolver', () => {
  let resolver: CloudflareResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudflareResolver],
    }).compile();

    resolver = module.get<CloudflareResolver>(CloudflareResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
