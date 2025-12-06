# Backend API - Task Management System

A production-ready Node.js/Express REST API with TypeScript, PostgreSQL, and comprehensive tooling.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Best Practices](#best-practices)
- [API Documentation](#api-documentation)

---

## Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript 5.9+
- **Framework**: Express.js
- **Database**: PostgreSQL 16
- **ORM**: Drizzle ORM (lightweight, type-safe)
- **Validation**: Zod
- **Testing**: Vitest + Supertest
- **Linting**: ESLint + Prettier
- **API Docs**: OpenAPI/Swagger
- **Package Manager**: pnpm

---

## Project Structure

```
backend/
├── src/
│   ├── config/                 # Configuration files
│   │   ├── database.ts         # Database connection
│   │   ├── env.ts              # Environment validation
│   │   └── swagger.ts          # API documentation config
│   ├── controllers/            # Request handlers
│   │   └── task.controller.ts
│   ├── services/               # Business logic
│   │   └── task.service.ts
│   ├── models/                 # Data models & schemas
│   │   ├── task.model.ts
│   │   └── task.schema.ts      # Zod validation schemas
│   ├── routes/                 # API routes
│   │   ├── index.ts            # Route aggregator
│   │   └── task.routes.ts
│   ├── middleware/             # Custom middleware
│   │   ├── errorHandler.ts
│   │   ├── validation.ts
│   │   ├── rateLimiter.ts
│   │   ├── logger.ts
│   │   └── auth.ts             # Future: JWT auth
│   ├── utils/                  # Utility functions
│   │   ├── logger.ts
│   │   ├── errors.ts
│   │   └── response.ts
│   ├── db/                     # Database related
│   │   ├── schema.ts           # Drizzle schema
│   │   ├── migrations/         # Database migrations
│   │   └── seed.ts             # Seed data
│   ├── types/                  # TypeScript types
│   │   ├── express.d.ts        # Express extensions
│   │   └── index.ts
│   ├── tests/                  # Test files
│   │   ├── unit/
│   │   ├── integration/
│   │   └── setup.ts
│   ├── app.ts                  # Express app setup
│   └── index.ts                # Entry point
├── .env.example                # Environment template
├── .env                        # Local environment (gitignored)
├── .eslintrc.json              # ESLint config
├── .prettierrc                 # Prettier config
├── .gitignore                  # Git ignore rules
├── Dockerfile                  # Docker container
├── docker-compose.yml          # Local development
├── tsconfig.json               # TypeScript config
├── vitest.config.ts            # Test config
├── drizzle.config.ts           # Drizzle ORM config
├── package.json                # Dependencies & scripts
└── README.md                   # This file
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL 16+ (or use Docker)
- Docker & Docker Compose (optional)

### Installation

1. **Clone and navigate:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. **Start PostgreSQL:**
   ```bash
   # Using Docker
   docker-compose up -d postgres

   # Or install PostgreSQL locally
   ```

5. **Run migrations:**
   ```bash
   pnpm db:migrate
   pnpm db:push
   ```

6. **Seed database (optional):**
   ```bash
   pnpm db:seed
   ```

7. **Start development server:**
   ```bash
   pnpm dev
   ```

Server runs at `http://localhost:3001`

---

## Development

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server with hot reload
pnpm dev:debug        # Start with debugger attached

# Building
pnpm build            # Compile TypeScript to JavaScript
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate migration files
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema to database
pnpm db:seed          # Seed database with test data
pnpm db:studio        # Open Drizzle Studio (DB GUI)

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting
pnpm type-check       # Run TypeScript compiler check

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Generate coverage report
pnpm test:unit        # Run unit tests only
pnpm test:integration # Run integration tests only

# Production
pnpm start:prod       # Start production build
```

### Environment Variables

Create a `.env` file:

```env
# Server
NODE_ENV=development
PORT=3001
API_PREFIX=/api/v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sadbits_db
DB_USER=postgres
DB_PASSWORD=postgres
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sadbits_db

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug               # error | warn | info | debug

# External Services (Future)
REDIS_URL=redis://localhost:6379
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

---

## Best Practices Implemented

### 1. **Clean Architecture / Layered Architecture**

```
Controller → Service → Database
     ↓          ↓
Validation  Business Logic
```

- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Models**: Define data structures
- **Middleware**: Cross-cutting concerns

### 2. **Error Handling**

**Custom Error Classes:**
```typescript
// src/utils/errors.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}
```

**Global Error Handler:**
```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Log unexpected errors
  logger.error('Unexpected error:', err);

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};
```

### 3. **Request Validation with Zod**

```typescript
// src/models/task.schema.ts
import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  due_date: z.string().datetime().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>;
```

**Validation Middleware:**
```typescript
// src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ValidationError(error.errors[0].message));
      } else {
        next(error);
      }
    }
  };
};
```

### 4. **Structured Logging**

```typescript
// src/utils/logger.ts
import winston from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// HTTP request logger middleware
import morgan from 'morgan';

export const httpLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }
);
```

### 5. **Rate Limiting**

```typescript
// src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // stricter limit for auth endpoints
  message: 'Too many authentication attempts, please try again later.',
});
```

### 6. **Security Best Practices**

```typescript
// src/app.ts
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
  credentials: true,
}));

// Compression
app.use(compression());

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Limit request body size
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

### 7. **Database Connection with Pooling**

```typescript
// src/config/database.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema';
import { logger } from '../utils/logger';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  logger.error('Unexpected database error:', err);
  process.exit(-1);
});

export const db = drizzle(pool, { schema });

export const connectDatabase = async () => {
  try {
    await pool.query('SELECT NOW()');
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};
```

### 8. **Graceful Shutdown**

```typescript
// src/index.ts
import { Server } from 'http';
import { logger } from './utils/logger';

let server: Server;

const startServer = async () => {
  try {
    await connectDatabase();

    server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`📚 API Docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  server.close(() => {
    logger.info('HTTP server closed');

    // Close database connections
    pool.end(() => {
      logger.info('Database pool closed');
      process.exit(0);
    });
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  gracefulShutdown('unhandledRejection');
});

startServer();
```

### 9. **Environment Validation**

```typescript
// src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3001'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  CORS_ORIGIN: z.string(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

export const env = envSchema.parse(process.env);
```

### 10. **API Versioning**

```typescript
// src/routes/index.ts
import { Router } from 'express';
import taskRoutes from './task.routes';

const router = Router();

// API v1
const v1Router = Router();
v1Router.use('/tasks', taskRoutes);

router.use('/v1', v1Router);

export default router;
```

---

## ESLint Configuration

Create `.eslintrc.json`:

```json
{
  "env": {
    "node": true,
    "es2022": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": [
    "@typescript-eslint",
    "import"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ],
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "prefer-const": "error",
    "no-var": "error"
  },
  "ignorePatterns": ["dist", "node_modules", "coverage"]
}
```

## Prettier Configuration

Create `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

---

## Testing

### Test Structure

```typescript
// src/tests/unit/task.service.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { TaskService } from '../../services/task.service';

describe('TaskService', () => {
  let taskService: TaskService;

  beforeEach(() => {
    taskService = new TaskService();
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo' as const,
        priority: 'medium' as const,
      };

      const task = await taskService.create(taskData);

      expect(task).toHaveProperty('id');
      expect(task.title).toBe(taskData.title);
    });

    it('should throw ValidationError for invalid data', async () => {
      const taskData = { title: '' }; // Invalid: empty title

      await expect(taskService.create(taskData as any)).rejects.toThrow();
    });
  });
});
```

### Integration Tests

```typescript
// src/tests/integration/task.routes.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app';

describe('Task API', () => {
  let taskId: number;

  it('POST /api/v1/tasks - should create a new task', async () => {
    const response = await request(app)
      .post('/api/v1/tasks')
      .send({
        title: 'Integration Test Task',
        description: 'Testing API',
        status: 'todo',
        priority: 'high',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    taskId = response.body.id;
  });

  it('GET /api/v1/tasks - should get all tasks', async () => {
    const response = await request(app)
      .get('/api/v1/tasks')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /api/v1/tasks/:id - should get task by id', async () => {
    const response = await request(app)
      .get(`/api/v1/tasks/${taskId}`)
      .expect(200);

    expect(response.body.id).toBe(taskId);
  });
});
```

---

## API Documentation

### Swagger/OpenAPI

```typescript
// src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'REST API for task management',
    },
    servers: [
      {
        url: 'http://localhost:3001/api/v1',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to API docs
};

export const swaggerSpec = swaggerJsdoc(options);
```

**Add to app.ts:**
```typescript
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

**Document endpoints:**
```typescript
/**
 * @openapi
 * /tasks:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post('/tasks', validate(createTaskSchema), createTask);
```

---

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins
- [ ] Configure rate limiting
- [ ] Set up monitoring (Sentry, DataDog)
- [ ] Set up logging aggregation
- [ ] Configure database backups
- [ ] Use connection pooling
- [ ] Enable compression
- [ ] Set security headers
- [ ] Review and test error handling
- [ ] Set up CI/CD pipeline
- [ ] Configure health checks
- [ ] Set up auto-scaling

### Docker Production

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist

USER node

EXPOSE 3001

CMD ["node", "dist/index.js"]
```

---

## Performance Optimization

1. **Database Indexing**
   ```sql
   CREATE INDEX idx_tasks_status ON tasks(status);
   CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
   ```

2. **Caching with Redis**
   ```typescript
   import Redis from 'ioredis';
   const redis = new Redis(process.env.REDIS_URL);

   // Cache frequently accessed data
   const cacheKey = `task:${id}`;
   const cached = await redis.get(cacheKey);

   if (cached) return JSON.parse(cached);

   const task = await db.query.tasks.findFirst({ where: eq(tasks.id, id) });
   await redis.setex(cacheKey, 3600, JSON.stringify(task));
   ```

3. **Query Optimization**
   ```typescript
   // Use select to fetch only needed fields
   const tasks = await db
     .select({ id: tasks.id, title: tasks.title })
     .from(tasks)
     .limit(100);
   ```

---

## Monitoring & Observability

```typescript
// src/middleware/metrics.ts
import promClient from 'prom-client';

const register = new promClient.Registry();

// HTTP request duration
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

register.registerMetric(httpRequestDuration);

export const metricsMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.labels(req.method, req.route?.path, res.statusCode).observe(duration);
  });

  next();
};

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

---

## Contributing

1. Follow the project structure
2. Write tests for new features
3. Update documentation
4. Follow code style (ESLint + Prettier)
5. Create meaningful commit messages
6. Open PR for review

---

## License

MIT

---

## Resources

- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Documentation](https://zod.dev/)

---

**Built with ❤️ for production-ready applications**
