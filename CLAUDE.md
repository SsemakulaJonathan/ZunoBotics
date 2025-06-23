# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development**: `npm run dev` or `pnpm dev` - starts Next.js development server
- **Build**: `npm run build` or `pnpm build` - creates production build
- **Start**: `npm run start` or `pnpm start` - runs production server
- **Lint**: `npm run lint` or `pnpm lint` - runs ESLint

## Database Commands

- **Database push**: `npx prisma db push` - push schema to database
- **Generate client**: `npx prisma generate` - generate Prisma client
- **Studio**: `npx prisma studio` - open Prisma Studio

## Architecture Overview

This is a Next.js 15 application for ZunoBotics, a platform empowering African innovation through robotics and automation. The application handles donations, project showcases, and partner management.

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **UI**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: PayPal integration for donations
- **Theme**: Dark/light mode support via next-themes

### Project Structure
- `app/` - Next.js App Router pages and API routes
- `components/` - Reusable React components (business logic)
- `components/ui/` - shadcn/ui component library
- `lib/` - Utility functions, database, and external service configs
- `prisma/` - Database schema and migrations
- `public/` - Static assets including project images and team photos

### Key Features
- **Donation System**: Multi-tier donation system with PayPal
- **Project Showcase**: University robotics projects with filtering
- **Partner Management**: Partner organizations and universities
- **Impact Tracking**: Fundraising statistics and impact metrics

### Database Models
- `Donation` - Tracks donations with payment status and metadata
- `Project` - University robotics projects with images and tags
- `Partner` - Partner organizations with logos and website links

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` - PayPal client ID for donations

### Component Patterns
- Uses shadcn/ui component system with Radix UI primitives
- Custom theme provider for dark/light mode switching
- Form handling with react-hook-form and Zod validation
- Responsive design with mobile-first approach
- Animation support with Framer Motion and Lottie

### API Routes
- `/api/donations/paypal` - Handle PayPal donation processing
- `/api/projects` - Project CRUD operations
- `/api/partners` - Partner management