# SadBits

A full-stack project designed to practice development skills and create useful tools for solo developers and game creators.

## Purpose

I (Albert) built this project for my personal use and hope it can help other people who are working as solo developers, game creators, or anyone working alone. The main goals of this project are:

- **Practice Skills**: Experiment with modern web technologies and best practices
- **Create Tools**: Build practical tools and utilities for solo development work
- **Learning**: Explore full-stack development, 3D graphics, and game development

## Project Structure

This monorepo contains three independent modules, each with its own purpose and technology stack:

### @server - Backend API
A production-ready NestJS GraphQL API with TypeScript, Prisma ORM, and PostgreSQL.

**Location**: `./server/`

**Tech**: NestJS, GraphQL, Prisma, PostgreSQL, TypeScript

**[→ Read Server README](./server/README.md)** for complete setup instructions.

### @client - Frontend Application
A modern React application with GraphQL integration, Shadcn UI components, and comprehensive form handling.

**Location**: `./client/`

**Tech**: React 19, Vite, Apollo Client, GraphQL Codegen, Tailwind CSS

**[→ Read Client README](./client/README.md)** for complete setup instructions.

### @mini-games - 3D Mini Games
A React application for creating 3D mini-games using React Three Fiber and Rapier physics engine.

**Location**: `./mini-games/`

**Tech**: React Three Fiber, Three.js, Rapier Physics, Vite

**[→ Read Mini-Games README](./mini-games/README.md)** for complete setup instructions.

## Getting Started

**IMPORTANT**: Each module has its own detailed README file with complete setup instructions. Please read the specific module's README before starting development.

### Quick Start

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd sadbits
   ```

2. Choose the module you want to work with and follow its README:
   - **Backend API**: See [server/README.md](./server/README.md)
   - **Frontend App**: See [client/README.md](./client/README.md)
   - **3D Games**: See [mini-games/README.md](./mini-games/README.md)

### Prerequisites

All modules require:
- Node.js 20+
- pnpm 10+

The server module additionally requires:
- Docker & Docker Compose (for PostgreSQL)

## Module Dependencies

- **@client** depends on **@server** (requires GraphQL API running)
- **@server** is independent (can run standalone)
- **@mini-games** is independent (can run standalone)

## Development Workflow

1. **Start the backend** (if using @client):
   ```bash
   cd server
   pnpm install
   docker-compose up -d
   pnpm start:dev
   ```

2. **Start the frontend** (in a new terminal):
   ```bash
   cd client
   pnpm install
   pnpm dev
   ```

3. **Start mini-games** (independent):
   ```bash
   cd mini-games
   pnpm install
   pnpm dev
   ```

## Technology Stack

### Backend (@server)
- NestJS 11
- GraphQL (Apollo Server)
- Prisma ORM
- PostgreSQL 15
- TypeScript

### Frontend (@client)
- React 19
- Vite 7
- Apollo Client
- GraphQL Code Generator
- Shadcn UI
- Tailwind CSS 4
- React Router Dom 7

### Mini-Games (@mini-games)
- React Three Fiber
- Three.js
- Rapier Physics Engine
- React Three Drei
- Tailwind CSS 4

## Features

### Current Features
- Task management system (backend + frontend)
- GraphQL API with type-safe client
- Database with Prisma ORM
- 3D game development environment

### Planned Features
- User authentication
- Real-time updates
- More mini-games
- Additional productivity tools

## Contributing

This is primarily a personal learning project, but suggestions and feedback are welcome.

## License

MIT License

## Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [GraphQL Documentation](https://graphql.org/learn/)

---

**Built by [Albert](https://www.linkedin.com/in/tam-nguyen-6a1576183/) for solo developers and creators**
