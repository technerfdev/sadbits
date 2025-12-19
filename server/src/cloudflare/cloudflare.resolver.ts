import { Query } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { CloudflareService } from './cloudflare.service';

@Resolver()
export class CloudflareResolver {
  constructor(private readonly cloudflareService: CloudflareService) {}
  @Query()
  analytics() {}
}
