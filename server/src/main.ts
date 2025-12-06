import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaServices } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', /// TODO: restrict after push to prod
    credential: false,
  });

  const prismaService = app.get(PrismaServices);
  await prismaService.$connect();

  await app.listen(process.env.PORT ?? 3000);
  app.useGlobalPipes(new ValidationPipe());
  console.log(`Server is running on: ${await app.getUrl()}`);
}
bootstrap();
