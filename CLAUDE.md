# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5.4 application with React 19.1, TypeScript, and Tailwind CSS v4. It's a fresh project bootstrapped with `create-next-app`.

## Common Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack (http://localhost:3000)

# Build & Production
npm run build            # Production build with Turbopack
npm run start            # Start production server

# Linting
npm run lint             # Run ESLint
```

## Architecture

This is a standard Next.js App Router project using the `app/` directory structure:

- `app/layout.tsx` - Root layout with Geist font
- `app/page.tsx` - Home page
- `app/globals.css` - Global styles (Tailwind CSS v4)
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript config with path alias `@/*` -> `./`

### Key Configurations

- **TypeScript**: Strict mode enabled, path alias `@/` maps to project root
- **ESLint**: Uses Next.js core web vitals + TypeScript configs
- **Tailwind**: v4 with PostCSS, configured in `postcss.config.mjs`

## Dependencies

- `next` (15.5.4) - React framework
- `react` (19.1.0) - UI library
- `react-dom` (19.1.0) - React DOM renderer
- `tailwindcss` (v4) - CSS framework
- `typescript` - Type checking

## Development Notes

- Use Turbopack for faster dev builds (`--turbopack` flag is in scripts)
- Route handlers go in `app/api/` directory
- Server components are the default in App Router
- Use `'use client'` directive for client-side components
