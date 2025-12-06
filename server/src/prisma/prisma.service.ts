import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaServices extends PrismaClient implements OnModuleInit {
  constructor() {
    const adapter = new PrismaPg({
      global: true,
      connectionString: process.env.DATABASE_URL,
    });
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Database connected');
    } catch (error) {
      console.error('xxxx Failed to connect to DB xxxx');
      throw error;
    }
  }
}
