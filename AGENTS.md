# AGENTS.md

## Development Commands

### Core Commands
- `npm run dev` - Start development server with turbopack
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality

### Note on Testing
This project does not currently have a test suite configured. When adding tests, first check package.json for test scripts or ask the user for the correct command.

## Code Style Guidelines

### General Architecture
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Context API for client-side state
- **Database**: PostgreSQL with @vercel/postgres
- **Validation**: Zod schemas for type-safe validation
- **Authentication**: NextAuth.js v5

### Component Patterns
- Server components are the default - no "use client" directive needed
- Client components must include `"use client";` at the top of the file
- Use React.FC for function components with explicit children typing
- Component interfaces should extend appropriate HTML attributes
- Use React.forwardRef for components that forward refs

### Server Actions
- Mark server actions with `"use server";` at the top
- Define Zod schemas for input validation at the top of action functions
- Use try-catch for error handling with console.error for logging
- Return objects with `{ success: boolean, error?: string, data?: T }` pattern
- Call `revalidatePath()` after mutations to refresh cache
- Use redirect() for navigation after successful mutations

### Imports and Dependencies
- Use path alias `@/*` for imports from root (configured in tsconfig.json)
- Import React hooks and types from "react"
- Use `@/components/ui/*` for shadcn/ui components
- Import database operations from `@/app/lib/actions`
- Import type definitions from `@/app/lib/definitions`
- Third-party libraries: date-fns, lucide-react, recharts

### Naming Conventions
- **Files**: kebab-case for components and pages (e.g., `date-picker.tsx`)
- **Components**: PascalCase (e.g., `DatePicker`, `BookingProvider`)
- **Functions**: camelCase (e.g., `fetchBookings`, `handleCreateBooking`)
- **Variables**: camelCase (e.g., `dateRange`, `isVegetarian`)
- **Constants**: PascalCase or UPPER_CASE for schemas (e.g., `BookMealSchema`, `defaultDateRange`)
- **Types/Interfaces**: PascalCase (e.g., `BookingContextType`, `ButtonProps`)

### Type Safety
- Use Zod schemas to define data models in `lib/definitions.ts`
- Export types with `export type Name = z.infer<typeof Schema>`
- Use `z.infer<typeof Schema>` for function parameters
- Database queries should be typed: `await sql<Type>\`...\``
- Context values should have explicit interfaces
- Avoid `any` types - use unknown or specific types

### Styling Guidelines
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Prefer Tailwind classes over inline styles
- Use class-variance-authority (cva) for component variants
- Follow shadcn/ui patterns for new components
- Use lucide-react for icons: `<IconName />`

### Error Handling
- Server actions: try-catch with console.error and return error object
- Client components: try-catch with console.error and user-facing alerts
- Context providers: setError state with error messages
- Always log errors before throwing or returning

### Path Aliases
- `@/*` → Root directory (configured in tsconfig.json)
- Examples: `@/components/ui/button`, `@/lib/utils`, `@/app/lib/actions`

### File Organization
- `/app` - Next.js app router pages and layouts
- `/app/admin` - Admin panel pages and contexts
- `/app/lib` - Server actions and definitions
- `/components` - Reusable UI components
- `/components/ui` - shadcn/ui base components
- `/lib` - Utility functions
- `/hooks` - Custom React hooks

### Code Quality
- Run `npm run lint` before committing changes
- ESLint extends next/core-web-vitals and next/typescript
- TypeScript strict mode is enabled
- Keep functions focused and single-purpose
- Use existing patterns and conventions over introducing new ones
