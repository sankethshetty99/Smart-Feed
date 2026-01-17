# Robinhood Smart Feed Prototype

## Overview

A mobile-responsive web application that provides retail traders with a personalized "smart feed" of trading opportunities. The app aggregates multi-source news into trade signals, displaying stocks with sentiment analysis, price changes, and news summaries. Built as a prototype for passive discovery investing similar to a social media feed experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with Vite for fast development and HMR
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state caching and synchronization
- **Styling**: Tailwind CSS with custom Robinhood-inspired theme (green/red color scheme)
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Animations**: Framer Motion for smooth list transitions
- **Icons**: Lucide React

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript throughout (shared types between client/server)
- **API Pattern**: RESTful endpoints defined in `shared/routes.ts` with Zod schema validation
- **Build System**: Custom esbuild + Vite build script for production bundling

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` - shared between frontend and backend
- **Database Tables**:
  - `users` - User accounts with risk tolerance preferences
  - `stocks` - Stock information (ticker, price, sector, daily change)
  - `user_interests` - User's holdings and watchlist items
  - `feed_items` - News items with sentiment scores and source counts
- **Migrations**: Drizzle Kit for schema migrations (`drizzle-kit push`)

### Key Design Decisions

1. **Shared Schema Pattern**: Database schema and Zod validators are defined once in `shared/` and imported by both client and server, ensuring type safety across the stack.

2. **Storage Abstraction**: Database operations go through a `DatabaseStorage` class implementing `IStorage` interface, allowing for easy testing or swapping storage backends.

3. **Smart Feed Algorithm**: The feed endpoint joins user interests with feed items, prioritizing stocks the user holds or watches, then filling with general market news.

4. **Mobile-First Design**: UI is built mobile-responsive with bottom navigation, touch-friendly cards, and Robinhood-inspired visual design.

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage in PostgreSQL (available but not currently active)

### Development Tools
- **Replit Plugins**: 
  - `@replit/vite-plugin-runtime-error-modal` for error display
  - `@replit/vite-plugin-cartographer` and `@replit/vite-plugin-dev-banner` for development environment

### API Endpoints
- `GET /api/feed/:userId` - Fetch personalized feed for a user
- `GET /api/users/:id` - Get user details
- `GET /api/users` - List all users
- `POST /api/seed` - Seed database with sample data

### Mock Data Note
The current implementation uses mock/seed data for stocks and news. The PRD indicates future integration with real stock data and news aggregation APIs.