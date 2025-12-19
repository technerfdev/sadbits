import { Module } from '@nestjs/common';
import { CloudflareService } from './cloudflare.service';
import { CloudflareResolver } from './cloudflare.resolver';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [CloudflareService, CloudflareResolver],
  exports: [CloudflareService],
})
export class CloudflareModule {}
