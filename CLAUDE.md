# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 skincare tracking application that helps users monitor their acne progress with AI-powered analysis, personalized skincare routines, and product recommendations. The app uses Convex for backend/database and Clerk for authentication.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4.x, shadcn/ui components (New York style)
- **Backend/Database**: Convex (real-time database with serverless functions)
- **Authentication**: Clerk (with @clerk/nextjs)
- **UI Components**: shadcn/ui (located in `components/ui/`)
- **Icons**: lucide-react

## Development Commands

Since there are no scripts defined in package.json, use standard Next.js commands:

```bash
# Development
npm run dev          # Start development server
npx convex dev       # Start Convex backend in development

# Build
npm run build        # Build for production
npm run start        # Start production server

# Type checking
npx tsc --noEmit     # Run TypeScript compiler without emitting files
```

## Architecture

### App Structure

The application follows Next.js App Router conventions with three main user flows:

1. **Landing** (`app/page.tsx`) → **Onboarding** (`app/onboarding/page.tsx`) → **Dashboard** (`app/dashboard/page.tsx`)
2. **Gallery** (`app/gallery/page.tsx`) - Photo tracking with timeline/grid views and comparisons
3. **Chat** (`app/chat/page.tsx`) - AI chatbot for skincare advice

### Route Organization

- `/` - Landing page
- `/sign-in`, `/sign-up` - Clerk authentication routes with catch-all segments
- `/onboarding` - Multi-step onboarding flow (6 steps)
- `/dashboard` - Main dashboard with routines overview
- `/gallery` - Photo timeline and comparison views
- `/chat` - AI chatbot interface

Layouts:
- `app/layout.tsx` - Root layout (no providers, just metadata)
- `app/dashboard/layout.tsx` - Wraps dashboard/gallery/chat with Navigation component
- Individual page layouts for gallery and chat

### Convex Backend Structure

The backend uses Convex with the following schema (`convex/schema.ts`):

- **users** - User profiles (indexed by `clerkId`)
- **skinProfiles** - Skin type, concerns, allergies, budget (indexed by `userId`)
- **photos** - Uploaded photos with optional AI analysis results (indexed by `userId`)
- **routines** - Morning/evening skincare routines (indexed by `userId`)
- **chatMessages** - Chat history with AI assistant (indexed by `userId`)

Convex functions are organized by domain:
- `convex/users.ts` - User CRUD operations
- `convex/skinProfiles.ts` - Skin profile management
- `convex/photos.ts` - Photo upload/retrieval
- `convex/routines.ts` - Routine generation
- `convex/chatMessages.ts` - Chat message storage

### Component Organization

**Feature Components** (in `components/`):
- `onboarding/` - 6-step onboarding flow (welcome, skin type, concerns, allergies, budget, additional info)
- `gallery/` - Photo gallery with timeline view, grid view, upload, and comparison
- `chat/` - Chat interface with message display and suggested questions
- `dashboard/` - Dashboard overview component

**Shared Components**:
- `navigation.tsx` - Main navigation bar with Dashboard/Gallery/Chat links
- `theme-provider.tsx` - Theme provider wrapper
- `convex-client-provider.tsx` - Convex client initialization (requires `NEXT_PUBLIC_CONVEX_URL`)

**UI Components** (`components/ui/`):
- Complete shadcn/ui component library
- All components use the New York style variant
- Tailwind CSS variables for theming (`cssVariables: true`)

### State Management

- **Onboarding**: Local component state with localStorage persistence (`onboarding-flow.tsx`)
- **Server State**: Convex queries and mutations (real-time sync)
- **Auth State**: Clerk handles authentication state

### Path Aliases

Configured in `tsconfig.json`:
```typescript
"@/*": ["./*"]
```

Used throughout the codebase:
- `@/components/*` - All components
- `@/lib/*` - Utilities (e.g., `cn()` for className merging)
- `@/hooks/*` - Custom hooks

### Configuration Notes

**Next.js Config** (`next.config.mjs`):
- TypeScript build errors are ignored (`ignoreBuildErrors: true`)
- Image optimization is disabled (`unoptimized: true`)

**Convex**: Functions directory is `convex/` (specified in `convex.json`)

**Environment Variables Required**:
- `NEXT_PUBLIC_CONVEX_URL` - Convex deployment URL
- Clerk environment variables (standard Clerk Next.js setup)

## Data Flow Patterns

1. **Authentication Flow**: Clerk handles auth → `createUser` mutation creates user in Convex → redirect to onboarding or dashboard
2. **Onboarding Flow**: Multi-step form → localStorage cache → final submission creates `skinProfile` → redirect to dashboard
3. **Photo Upload**: Upload to Convex storage → create photo record → optional AI analysis → display in gallery
4. **Chat**: User message → save to Convex → AI response (to be implemented) → save to Convex → real-time display

## Key Implementation Details

- The app uses client-side routing with Next.js App Router
- Convex provides real-time data synchronization
- shadcn/ui components are pre-installed and ready to use
- The onboarding flow stores data in localStorage before persisting to Convex
- Photo analysis results are stored directly in the photo record (not separate table)
