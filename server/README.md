# @server - SadBits Backend

A production-ready NestJS GraphQL API with TypeScript, Prisma ORM, and PostgreSQL.

## Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript 5.9+
- **Framework**: NestJS 11
- **API**: GraphQL (Apollo Server)
- **Database**: PostgreSQL 15
- **ORM**: Prisma 7.0
- **Validation**: class-validator
- **Testing**: Jest
- **Package Manager**: pnpm

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 20+ ([Download](https://nodejs.org/))
- pnpm 10+ (`npm install -g pnpm`)
- Docker & Docker Compose ([Download](https://www.docker.com/products/docker-desktop))

## Getting Started

### 1. Install Dependencies

```bash
cd server
pnpm install
```

### 2. Start PostgreSQL Database

Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d
```

This will start a PostgreSQL 15 container with:
- **Database**: `sadbits_db`
- **User**: `admin`
- **Password**: `@admin123`
- **Port**: `5432`
- **Container Name**: `sadbits-postgres-db`

To verify the database is running:

```bash
docker ps
```

### 3. Configure Environment

The application reads database configuration from environment variables. The default configuration matches the docker-compose setup:

- **Database URL**: `postgresql://admin:@admin123@localhost:5432/sadbits_db`
- **Port**: `3000`

If you need custom configuration, you can set environment variables:

```bash
export DATABASE_URL="postgresql://admin:@admin123@localhost:5432/sadbits_db"
export PORT=3000
```

### 4. Set Up Database Schema

Run Prisma migrations to set up the database schema:

```bash
# Pull schema from database (if exists)
pnpm prisma:update

# Or generate Prisma client only
pnpm prisma:generate
```

The database includes the following tables:
- **tasks**: Task management with priority levels
- **users**: User information
- **projects**: Project organization

### 5. Start Development Server

```bash
pnpm start:dev
```

The server will start at `http://localhost:3000`

GraphQL Playground is available at `http://localhost:3000/graphql`

## Available Scripts

### Development

```bash
pnpm start:dev          # Start server in watch mode
pnpm start:debug        # Start server with debugging enabled
```

### Building

```bash
pnpm build              # Build for production
pnpm start              # Start production server
pnpm start:prod         # Start built production server
```

### Database

```bash
pnpm prisma:update      # Pull DB schema, transform to camelCase, generate client
pnpm prisma:camelcase   # Transform snake_case to camelCase
pnpm prisma:generate    # Generate Prisma client
```

The `prisma:camelcase` script uses `scripts/prisma-transform.ts` to convert database snake_case naming to TypeScript camelCase.

### Testing

```bash
pnpm test               # Run unit tests
pnpm test:watch         # Run tests in watch mode
pnpm test:cov           # Generate coverage report
pnpm test:debug         # Run tests with debugger
pnpm test:e2e           # Run end-to-end tests
```

### Code Quality

```bash
pnpm lint               # Run ESLint with auto-fix
pnpm format             # Format code with Prettier
```

## Project Structure

```
server/
├── src/
│   ├── prisma/                    # Prisma configuration
│   │   ├── schema.prisma          # Database schema
│   │   ├── schema-template.prisma # Schema template
│   │   ├── prisma.service.ts      # Prisma service
│   │   └── migrations/            # Database migrations
│   ├── tasks/                     # Task module (example)
│   ├── app.module.ts              # Root application module
│   └── main.ts                    # Application entry point
├── scripts/
│   └── prisma-transform.ts        # Schema transformation script
├── test/                          # E2E tests
├── docker-compose.yml             # PostgreSQL setup
├── nest-cli.json                  # NestJS CLI config
├── jest.config.ts                 # Jest configuration
├── tsconfig.json                  # TypeScript config
└── package.json                   # Dependencies & scripts
```

## GraphQL API

### Accessing GraphQL Playground

Once the server is running, open your browser and navigate to:

```
http://localhost:3000/graphql
```

The GraphQL Playground provides:
- Interactive query/mutation builder
- Schema documentation
- Query history
- Auto-completion

### Example Queries

```graphql
# Query all tasks
query GetTasks {
  tasks {
    id
    title
    description
    completed
    priority
    dueDate
  }
}

# Query a specific task
query GetTask($id: String!) {
  task(id: $id) {
    id
    title
    description
    completed
  }
}

# Create a task
mutation CreateTask($input: CreateTaskInput!) {
  createTask(input: $input) {
    id
    title
    completed
  }
}

# Update a task
mutation UpdateTask($id: String!, $input: UpdateTaskInput!) {
  updateTask(id: $id, input: $input) {
    id
    title
    completed
  }
}
```

## Database Schema

The application uses Prisma with PostgreSQL. The schema includes:

### Tasks
- `id` (UUID): Primary key
- `title` (String): Task title
- `description` (String): Task description
- `completed` (Boolean): Completion status
- `dueDate` (DateTime): Due date
- `priority` (Enum): low | medium | high
- `projectId` (UUID): Associated project
- `archived` (Boolean): Archive status
- `createdAt`, `updatedAt`: Timestamps

### Users
- `id` (UUID): Primary key
- `firstName`, `lastName` (String): User name
- `email` (String): Unique email
- `avatar` (String): Avatar URL
- `createdAt` (DateTime): Creation timestamp

### Projects
- `id` (UUID): Primary key
- `name` (String): Project name
- `description` (String): Project description
- `createdAt` (DateTime): Creation timestamp

## Rate Limiting

The API includes rate limiting configured via `@nestjs/throttler`. Check `rate-limit.md` for details.

## Docker Commands

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View logs
docker-compose logs -f postgres

# Remove database and volumes
docker-compose down -v

# Restart database
docker-compose restart postgres
```

## Database Connection

To connect to the PostgreSQL database directly:

```bash
# Using psql
psql postgresql://admin:@admin123@localhost:5432/sadbits_db

# Using Docker exec
docker exec -it sadbits-postgres-db psql -U admin -d sadbits_db
```

## Troubleshooting

### Port Already in Use

If port 5432 is already in use:

```bash
# Find process using port 5432
lsof -i :5432

# Kill the process or change the port in docker-compose.yml
```

### Database Connection Failed

1. Ensure Docker container is running:
   ```bash
   docker ps | grep sadbits-postgres-db
   ```

2. Check database logs:
   ```bash
   docker-compose logs postgres
   ```

3. Verify connection string matches docker-compose settings

### Prisma Client Out of Sync

If you get Prisma client errors:

```bash
pnpm prisma:generate
```

## Environment Variables

The application uses the following environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://admin:@admin123@localhost:5432/sadbits_db` | PostgreSQL connection string |
| `PORT` | `3000` | Server port |

## Production Deployment

### Building for Production

```bash
pnpm build
```

### Running Production Build

```bash
pnpm start:prod
```

### Production Checklist

- [ ] Set production `DATABASE_URL`
- [ ] Configure proper CORS origins (update `main.ts:9`)
- [ ] Set up SSL/TLS for database connection
- [ ] Configure environment-based logging
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure rate limiting for production
- [ ] Run database migrations
- [ ] Set up database backups
- [ ] Configure reverse proxy (nginx)
- [ ] Set up health checks

## Development Guidelines

### Adding a New Module

```bash
nest g module <module-name>
nest g service <module-name>
nest g resolver <module-name>
```

### Database Changes

1. Update `schema.prisma`
2. Create migration:
   ```bash
   npx prisma migrate dev --name <migration-name>
   ```
3. Generate client:
   ```bash
   pnpm prisma:generate
   ```

### GraphQL Schema

NestJS uses code-first approach. The GraphQL schema is auto-generated from TypeScript decorators. Check `schema.gql` for the generated schema.

## Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [GraphQL Documentation](https://graphql.org/learn/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## License

MIT License
