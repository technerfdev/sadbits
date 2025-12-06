# @client - SadBits Frontend

A modern React application built with Vite, TypeScript, Apollo Client for GraphQL, and Shadcn UI components.

## Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript 5.9+
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Routing**: React Router Dom 7 (Data Mode)
- **GraphQL Client**: Apollo Client 4
- **Code Generation**: GraphQL Code Generator
- **UI Components**: Shadcn UI (Radix UI)
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form + Zod validation
- **Date Handling**: date-fns (UTC format from backend)
- **Package Manager**: pnpm

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 20+ ([Download](https://nodejs.org/))
- pnpm 10+ (`npm install -g pnpm`)
- Backend server running at `http://localhost:3000` (see `@server` README)

## Getting Started

### 1. Install Dependencies

```bash
cd client
pnpm install
```

### 2. Start Backend Server

Ensure the backend GraphQL server is running at `http://localhost:3000/graphql`. See the `@server` README for setup instructions.

The client is configured to connect to the GraphQL endpoint at `http://localhost:3000/graphql` (see `codegen.ts:4`).

### 3. Generate GraphQL Types

The application uses GraphQL Code Generator to create TypeScript types from your GraphQL schema and queries:

```bash
# Generate types once
pnpm codegen

# Watch mode (auto-regenerate on changes)
pnpm codegen:watch
```

This will:
- Fetch the schema from `http://localhost:3000/graphql`
- Scan all `.graphql` and `.gql` files in `src/`
- Generate TypeScript types in `src/gql/`
- Create `schema.graphql` with the full schema

### 4. Start Development Server

```bash
pnpm dev
```

The application will start at `http://localhost:5173` (default Vite port).

Note: The `dev` script automatically runs `codegen` before starting the dev server.

## Available Scripts

### Development

```bash
pnpm dev                # Generate types and start dev server
pnpm preview            # Preview production build locally
```

### Building

```bash
pnpm build              # Type-check and build for production
```

### GraphQL Code Generation

```bash
pnpm codegen            # Generate TypeScript types from GraphQL
pnpm codegen:watch      # Watch mode for automatic regeneration
```

### Code Quality

```bash
pnpm lint               # Run ESLint
pnpm format             # Format code with Prettier
pnpm format:check       # Check code formatting
```

## Project Structure

```
client/
├── src/
│   ├── components/         # Reusable UI components
│   │   └── ui/             # Shadcn UI components
│   ├── gql/                # Generated GraphQL types (auto-generated)
│   │   └── schema.graphql  # GraphQL schema copy
│   ├── pages/              # Route pages
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── graphql/            # GraphQL queries, mutations (.graphql files)
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── components.json         # Shadcn UI config
├── codegen.ts              # GraphQL Code Generator config
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
├── tsconfig.json           # TypeScript config
└── package.json            # Dependencies & scripts
```

## GraphQL Integration

### Apollo Client Setup

The application uses Apollo Client for GraphQL operations. Configure your Apollo Client in your app:

```typescript
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      {/* Your app */}
    </ApolloProvider>
  );
}
```

### Creating GraphQL Queries

1. Create a `.graphql` file in `src/` (e.g., `src/graphql/tasks.graphql`):

```graphql
query GetTasks {
  tasks {
    id
    title
    description
    completed
    priority
  }
}

mutation CreateTask($input: CreateTaskInput!) {
  createTask(input: $input) {
    id
    title
    completed
  }
}
```

2. Run code generation:

```bash
pnpm codegen
```

3. Use the generated hooks in your components:

```typescript
import { useGetTasksQuery, useCreateTaskMutation } from '@/gql/graphql';

function TaskList() {
  const { data, loading, error } = useGetTasksQuery();
  const [createTask] = useCreateTaskMutation();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.tasks.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
}
```

### Code Generator Configuration

The `codegen.ts` file configures GraphQL Code Generator:

```typescript
{
  schema: 'http://localhost:3000/graphql',    // GraphQL endpoint
  documents: ['src/**/*.graphql'],             // Query/mutation files
  generates: {
    './src/gql/': {
      preset: 'client',                        // React hooks
      config: {
        documentMode: 'string',
        useTypeImports: true
      },
      presetConfig: {
        fragmentMasking: false                 // Disable fragment masking
      }
    }
  }
}
```

## UI Components (Shadcn)

The project uses Shadcn UI components. To add new components:

```bash
# Install a component
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add form
```

Components are installed to `src/components/ui/` and can be customized.

Available components: [https://ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)

## Routing (React Router Dom)

The application uses **React Router Dom v7 in Data Mode**.

Data Mode features:
- Control over bundling and data
- Custom server abstractions
- Data loaders and actions
- Type-safe routing

Example route setup:

```typescript
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'tasks',
        element: <Tasks />,
        loader: async () => {
          // Fetch data here
        },
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
```

Learn more: [React Router Modes](https://reactrouter.com/start/modes#picking-a-mode)

## Date Handling

The application uses `date-fns` for date manipulation.

**IMPORTANT**: The backend always returns dates in UTC format. Use `@date-fns/utc` or `@date-fns/tz` for timezone conversions.

```typescript
import { formatInTimeZone } from '@date-fns/tz';
import { parseISO } from 'date-fns';

// Backend returns UTC
const utcDate = parseISO('2024-01-15T10:00:00Z');

// Convert to user's timezone for display
const formatted = formatInTimeZone(
  utcDate,
  'America/New_York',
  'PPpp'
);
```

## Form Handling

The application uses React Hook Form with Zod validation:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function TaskForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      {errors.title && <span>{errors.title.message}</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Styling with Tailwind CSS

The project uses Tailwind CSS 4 with the Vite plugin:

```typescript
// Usage in components
function Button() {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Click me
    </button>
  );
}
```

Utility libraries included:
- `clsx`: Conditional classes
- `tailwind-merge`: Merge Tailwind classes
- `class-variance-authority`: Variant-based styling

## Path Aliases

The project uses `@` as an alias for the `src` directory:

```typescript
// Instead of
import { Button } from '../../../components/ui/button';

// Use
import { Button } from '@/components/ui/button';
```

## Environment Variables

Create a `.env` file in the client directory if needed:

```env
VITE_GRAPHQL_URL=http://localhost:3000/graphql
VITE_API_URL=http://localhost:3000
```

Access in code:

```typescript
const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL;
```

## Additional Libraries

### Rich Text Editor
- `lexical`: Text editor framework
- `@lexical/react`: React bindings
- `@lexical/rich-text`: Rich text plugin

### Image Handling
- `pexels`: Pexels API client for stock photos

### Canvas/Graphics
- `konva`: Canvas library
- `react-konva`: React wrapper for Konva

### UI Utilities
- `lucide-react`: Icon library
- `sonner`: Toast notifications
- `next-themes`: Dark mode support
- `react-day-picker`: Date picker
- `react-resizable-panels`: Resizable panel layouts

## Troubleshooting

### GraphQL Code Generation Fails

If code generation fails:

1. Ensure backend is running at `http://localhost:3000/graphql`
2. Check that your `.graphql` files have valid syntax
3. Clear generated files and regenerate:
   ```bash
   rm -rf src/gql
   pnpm codegen
   ```

### Type Errors After Schema Changes

When the backend schema changes:

```bash
pnpm codegen
```

This will regenerate all TypeScript types to match the new schema.

### Port Already in Use

If port 5173 is already in use, Vite will automatically try the next available port. To specify a custom port:

```bash
vite --port 3001
```

Or update `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 3001,
  },
});
```

### Apollo Client Cache Issues

If you see stale data:

```typescript
// Refetch query
const { refetch } = useGetTasksQuery();
await refetch();

// Or clear cache
client.cache.reset();
```

## Development Workflow

1. Start backend server (`@server`)
2. Generate GraphQL types: `pnpm codegen`
3. Start dev server: `pnpm dev`
4. Write `.graphql` queries/mutations
5. Regenerate types: `pnpm codegen` or use watch mode
6. Use generated hooks in components

## Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

The production build:
- Type-checks all TypeScript files
- Optimizes and bundles with Vite
- Outputs to `dist/` directory

## Deployment

The built files in `dist/` can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

Ensure the GraphQL endpoint is configured for production:

```typescript
const client = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_URL || 'https://api.production.com/graphql',
  cache: new InMemoryCache(),
});
```

## Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)
- [Shadcn UI Components](https://ui.shadcn.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [date-fns Documentation](https://date-fns.org/)

## License

MIT License
