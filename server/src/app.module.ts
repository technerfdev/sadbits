import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { PrismaServices } from './prisma/prisma.service';
import { TaskModule } from './task/task.module';
import { ProjectsService } from './projects/projects.service';
import { ProjectsResolver } from './projects/projects.resolver';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get('THROTTLER_TTL') || 60000,
            limit: config.get('THROTTLER_LIMIT') || 100,
            blockDuration: config.get('THROTTLER_BLOCK_DURATION'),
          },
        ],
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
      graphiql: true,
      introspection: true,
      sortSchema: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
    }),
    TaskModule,
    ConfigModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaServices,
    ConfigService,
    ProjectsService,
    ProjectsResolver,
  ],
})
export class AppModule {}
