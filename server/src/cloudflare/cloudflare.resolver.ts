import { Args, Query, Resolver } from '@nestjs/graphql';
import { CloudflareService } from './cloudflare.service';
import { Analytics } from './dto/analytics.types';

@Resolver()
export class CloudflareResolver {
  constructor(private readonly cloudflareService: CloudflareService) {}

  @Query(() => Analytics, { name: 'cloudflareAnalytics' })
  async getAnalytics(
    @Args('since', { nullable: true }) since?: string,
    @Args('until', { nullable: true }) until?: string,
  ): Promise<Analytics | null> {
    return this.cloudflareService.getAnalytics(since, until);
  }
}
