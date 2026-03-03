# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application with React 19, TypeScript, and Tailwind CSS v4. It uses shadcn/ui components, better-auth for authentication, Drizzle ORM with PostgreSQL, and react-hook-form with zod for form validation.

## Common Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Database
npx drizzle-kit push    # Push schema to database
npx drizzle-kit studio  # Open Drizzle Studio

# Build & Production
npm run build            # Production build
npm run start            # Start production server

# Linting
npm run lint             # Run ESLint
```

## Architecture

### App Router Structure
- `app/layout.tsx` - Root layout with providers (theme, sonner toasts)
- `app/(store)/` - Store-facing routes with StoreLayout
- `app/auth/` - Authentication routes (sign-up, etc.)
- `app/api/auth/[...all]/route.ts` - better-auth API handler

### Key Directories
- `components/ui/` - shadcn/ui components (button, card, input, field, label, badge, sheet, dropdown-menu, separator, sonner)
- `components/layout/` - StoreLayout components (store-header, store-footer)
- `components/providers/` - Theme provider and toast provider
- `lib/` - Utilities (cn), auth client, validations
- `database/` - Drizzle ORM setup and schemas
- `app/auth/` - Auth pages and server actions

### Authentication
- Uses **better-auth** with next.js plugin
- Database adapter: **drizzle-adapter** for PostgreSQL
- Session management via cookies
- Server actions in `app/auth/actions.ts` for form submissions

### Form Handling
- **react-hook-form** for form state management
- **zod** for schema validation
- **@hookform/resolvers** to integrate zod with react-hook-form
- shadcn/ui **field**, **input**, and **label** components for forms

### Database
- **PostgreSQL** with **Drizzle ORM**
- Schema in `database/schemas/auth.schema.ts` (user, session, account, verification tables)
- Configuration in `drizzle.config.ts`

### UI Components
- shadcn/ui configured with "new-york" style
- Radix UI primitives under the hood
- **tailwind-merge** + **clsx** for class merging (`lib/utils.ts` -> `cn()`)
- **lucide-react** for icons
- **sonner** for toast notifications

### State Management
- **zustand** for client-side state (if used)

### Environment Variables (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/
BETTER_AUTH_SECRET=<secret>
BETTER_AUTH_URL=http://localhost:3000
# Add DATABASE_URL for PostgreSQL
```

## Key Configurations

- **TypeScript**: Strict mode enabled, path alias `@/` maps to project root
- **ESLint**: Uses Next.js core web vitals + TypeScript configs
- **Tailwind**: v4 with PostCSS, CSS variables in `app/globals.css`
- **shadcn**: `components.json` in project root
