# Rate Limiting (Throttler) Best Practices

This document outlines best practices for configuring rate limiting using NestJS Throttler in our application.

## Overview

Rate limiting (throttling) protects your API from abuse by limiting the number of requests a client can make within a time window. This prevents:
- DDoS attacks
- Brute force attempts
- Resource exhaustion
- API abuse

## Configuration Strategy

### Environment-Based Configuration

Different environments should have different limits:

```typescript
// server/src/app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            name: 'short',
            ttl: 1000,  // 1 second
            limit: config.get('NODE_ENV') === 'production' ? 3 : 100,
          },
          {
            name: 'medium',
            ttl: 10000,  // 10 seconds
            limit: config.get('NODE_ENV') === 'production' ? 20 : 1000,
          },
          {
            name: 'long',
            ttl: 60000,  // 1 minute
            limit: config.get('NODE_ENV') === 'production' ? 100 : 10000,
          },
        ],
      }),
    }),
  ],
})
```

## Recommended Limits by Operation Type

### Read Operations (Queries)
- **TTL:** 60000ms (1 minute)
- **Limit:** 100 requests
- **Use case:** GET requests, GraphQL queries

### Write Operations (Mutations)
- **TTL:** 60000ms (1 minute)
- **Limit:** 20 requests
- **Use case:** POST/PUT/DELETE requests, GraphQL mutations

### Authentication Endpoints
- **TTL:** 900000ms (15 minutes)
- **Limit:** 5 requests
- **Use case:** Login, register, password reset

### Public APIs
- **TTL:** 60000ms (1 minute)
- **Limit:** 30 requests
- **Use case:** Publicly accessible endpoints

### File Uploads
- **TTL:** 3600000ms (1 hour)
- **Limit:** 10 requests
- **Use case:** Image/document uploads

### Health Checks / Monitoring
- **No throttling**
- **Use case:** Kubernetes probes, monitoring services

## Multiple Throttler Tiers (Recommended)

Using multiple tiers provides layered protection:

```typescript
@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 1000,      // 1 second
          limit: 10,      // Burst protection: 10 req/sec
        },
        {
          name: 'medium',
          ttl: 60000,     // 1 minute
          limit: 100,     // Normal usage: 100 req/min
        },
        {
          name: 'long',
          ttl: 3600000,   // 1 hour
          limit: 1000,    // Heavy usage protection: 1000 req/hour
        },
      ],
    }),
  ],
})
```

**Why multiple tiers?**
- **Short:** Prevents rapid-fire attacks (burst protection)
- **Medium:** Handles normal API usage patterns
- **Long:** Catches sustained abuse over time

## Per-Route Customization

### Using Decorators

```typescript
// server/src/task/task.resolver.ts
import { Throttle, SkipThrottle } from '@nestjs/throttler';

@Resolver(() => Task)
export class TaskResolver {
  // Use default throttler configuration
  @Query(() => [Task])
  async tasks(@Args('filter', { nullable: true }) filter?: FilterInput) {
    return this.taskService.findAll(filter);
  }

  // Custom limit for mutations (stricter)
  @Throttle({ short: { ttl: 1000, limit: 3 }, medium: { ttl: 60000, limit: 10 } })
  @Mutation(() => Task)
  async createTask(@Args('input') input: CreateTaskInput) {
    return this.taskService.create(input);
  }

  // Completely skip throttling for specific routes
  @SkipThrottle()
  @Query(() => String)
  async healthCheck() {
    return 'OK';
  }

  // Skip only specific throttler tiers
  @SkipThrottle({ short: true })  // Skip burst protection, keep others
  @Query(() => [Task])
  async backgroundSync() {
    return this.taskService.syncTasks();
  }
}
```

### Common Patterns

```typescript
// Authentication resolver
@Resolver(() => Auth)
export class AuthResolver {
  // Strict limit on login attempts
  @Throttle({ short: { ttl: 60000, limit: 5 } })  // 5 attempts per minute
  @Mutation(() => AuthResponse)
  async login(@Args('email') email: string, @Args('password') password: string) {
    return this.authService.login(email, password);
  }

  // Even stricter for password reset
  @Throttle({ short: { ttl: 3600000, limit: 3 } })  // 3 attempts per hour
  @Mutation(() => Boolean)
  async requestPasswordReset(@Args('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }
}
```

## Storage Options

### In-Memory (Default)

Good for:
- Development
- Single-instance deployments
- Testing

```typescript
ThrottlerModule.forRoot({
  throttlers: [{ ttl: 60000, limit: 10 }],
  // Uses in-memory storage by default
})
```

**Limitations:**
- Not shared across multiple app instances
- Lost on server restart
- Not suitable for production with load balancing

### Redis (Recommended for Production)

Good for:
- Production environments
- Multi-instance deployments
- Load-balanced applications
- Persistent rate limiting

```typescript
import { ThrottlerStorageRedisService } from '@nestjs/throttler-storage-redis';
import Redis from 'ioredis';

ThrottlerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    throttlers: [
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 60000, limit: 100 },
    ],
    storage: new ThrottlerStorageRedisService(
      new Redis({
        host: config.get('REDIS_HOST') || 'localhost',
        port: config.get('REDIS_PORT') || 6379,
        password: config.get('REDIS_PASSWORD'),
        db: config.get('REDIS_THROTTLER_DB') || 1,
      })
    ),
  }),
})
```

**Installation:**
```bash
cd server
pnpm add @nestjs/throttler-storage-redis ioredis
pnpm add -D @types/ioredis
```

## Complete Production-Ready Configuration

### Config File

```typescript
// server/src/config/throttler.config.ts
export const throttlerConfig = {
  development: {
    throttlers: [
      { name: 'short', ttl: 1000, limit: 1000 },    // Very permissive
      { name: 'long', ttl: 60000, limit: 10000 },
    ],
  },
  test: {
    throttlers: [
      { name: 'short', ttl: 1000, limit: 10000 },   // Essentially disabled
    ],
  },
  production: {
    throttlers: [
      { name: 'short', ttl: 1000, limit: 10 },      // 10 req/sec
      { name: 'medium', ttl: 60000, limit: 100 },   // 100 req/min
      { name: 'long', ttl: 3600000, limit: 1000 },  // 1000 req/hour
    ],
  },
};
```

### App Module

```typescript
// server/src/app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { throttlerConfig } from './config/throttler.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const env = config.get('NODE_ENV') || 'development';
        return throttlerConfig[env] || throttlerConfig.development;
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,  // Apply throttling globally
    },
  ],
})
export class AppModule {}
```

## Custom Error Responses

### Custom Guard

```typescript
// server/src/common/guards/custom-throttler.guard.ts
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(context: ExecutionContext): Promise<void> {
    const response = context.switchToHttp().getResponse();
    const request = context.switchToHttp().getRequest();

    // Add Retry-After header
    const retryAfter = 60; // seconds
    response.header('Retry-After', retryAfter);

    throw new HttpException(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: 'Too many requests. Please try again later.',
        error: 'Rate Limit Exceeded',
        retryAfter,
        path: request.url,
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
```

### Using Custom Guard

```typescript
// server/src/app.module.ts
providers: [
  {
    provide: APP_GUARD,
    useClass: CustomThrottlerGuard,  // Use custom guard
  },
]
```

## GraphQL-Specific Configuration

### Skip Introspection Queries

GraphQL introspection should not be throttled:

```typescript
// server/src/app.module.ts
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: 'schema.gql',
  introspection: true,
  playground: {
    settings: {
      'request.credentials': 'include',
    },
  },
  context: ({ req, res }) => ({ req, res }),
  formatError: (error) => {
    // Custom error formatting for throttling errors
    if (error.extensions?.code === 'THROTTLED') {
      return {
        message: 'Rate limit exceeded',
        extensions: {
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: 60,
        },
      };
    }
    return error;
  },
})
```

### Per-Resolver Throttling

```typescript
// server/src/task/task.resolver.ts
@Resolver(() => Task)
@UseGuards(GqlThrottlerGuard)  // Apply to entire resolver
export class TaskResolver {
  @Query(() => [Task])
  async tasks() {
    return this.taskService.findAll();
  }

  @SkipThrottle()  // Skip for this specific query
  @Query(() => Task)
  async task(@Args('id') id: string) {
    return this.taskService.findOne(id);
  }
}
```

## Monitoring and Logging

### Log Throttled Requests

```typescript
// server/src/common/interceptors/throttle-logger.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ThrottleLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ThrottleLoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error.status === 429) {
          const request = context.switchToHttp().getRequest();
          this.logger.warn(
            `Rate limit exceeded: ${request.method} ${request.url} - IP: ${request.ip}`,
          );
        }
        return throwError(() => error);
      }),
    );
  }
}
```

### Metrics Collection

```typescript
// Track throttled requests for monitoring
import { Counter } from 'prom-client';

const throttledRequestsCounter = new Counter({
  name: 'http_throttled_requests_total',
  help: 'Total number of throttled requests',
  labelNames: ['method', 'path'],
});

// In your custom guard
protected async throwThrottlingException(context: ExecutionContext): Promise<void> {
  const request = context.switchToHttp().getRequest();
  throttledRequestsCounter.inc({
    method: request.method,
    path: request.url,
  });

  // ... throw exception
}
```

## Testing

### Disable Throttling in Tests

```typescript
// server/test/app.e2e-spec.ts
const moduleFixture: TestingModule = await Test.createTestingModule({
  imports: [AppModule],
})
  .overrideProvider(APP_GUARD)
  .useValue({})  // Disable throttler guard
  .compile();
```

### Test Throttling Behavior

```typescript
// server/test/throttling.e2e-spec.ts
describe('Throttling (e2e)', () => {
  it('should throttle after limit exceeded', async () => {
    const requests = [];

    // Make 11 requests (limit is 10)
    for (let i = 0; i < 11; i++) {
      requests.push(
        request(app.getHttpServer())
          .get('/tasks')
          .expect(i < 10 ? 200 : 429)
      );
    }

    await Promise.all(requests);
  });
});
```

## Common Patterns Summary

| Endpoint Type | TTL | Limit | Example |
|--------------|-----|-------|---------|
| Read (Query) | 60s | 100 | `tasks`, `users` |
| Write (Mutation) | 60s | 20 | `createTask`, `updateTask` |
| Authentication | 15min | 5 | `login`, `register` |
| Password Reset | 1hr | 3 | `requestPasswordReset` |
| File Upload | 1hr | 10 | `uploadImage` |
| Public API | 60s | 30 | Public endpoints |
| Health Check | N/A | ∞ | `healthCheck`, Kubernetes probes |

## Recommended Starting Point

For a typical GraphQL API, start with:

```typescript
ThrottlerModule.forRoot({
  throttlers: [
    {
      name: 'default',
      ttl: 60000,      // 1 minute
      limit: 100,      // 100 requests per minute
    },
  ],
})
```

## Tuning Guidelines

1. **Monitor:** Track 429 responses in your logs/metrics
2. **Analyze:** Look at legitimate traffic patterns
3. **Adjust:** Increase/decrease based on actual usage
4. **Customize:** Add per-route limits for sensitive operations
5. **Test:** Load test before deploying to production

## Security Considerations

- **Always throttle authentication endpoints** (prevents brute force)
- **Use stricter limits for mutations** (more expensive than queries)
- **Consider IP-based + user-based throttling** (if using authentication)
- **Monitor for distributed attacks** (many IPs at once)
- **Use Redis in production** (shared state across instances)
- **Add rate limit headers** (inform clients of limits)

## Related Documentation

- NestJS Throttler: https://docs.nestjs.com/security/rate-limiting
- Prisma Performance: https://www.prisma.io/docs/guides/performance-and-optimization
- Project Architecture: [./architecture.md](./architecture.md)
