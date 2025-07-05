# GoalBot - Telegram Group Goal Manager

## Overview

GoalBot is a full-stack web application that provides a Telegram bot for managing group goals. The system consists of a React frontend for monitoring bot status and an Express.js backend that handles the Telegram bot functionality and API endpoints.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite with custom configuration for monorepo structure

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Bot Framework**: node-telegram-bot-api for Telegram integration
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: connect-pg-simple for PostgreSQL-backed sessions
- **Development**: tsx for TypeScript execution

### Data Storage Solutions
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with schema-first approach
- **Migration Strategy**: Drizzle Kit for database migrations
- **Storage Interface**: Abstract storage interface with in-memory fallback

## Key Components

### Database Schema
- **Users Table**: Basic user management (id, username, password)
- **Goals Table**: Goal tracking with chat association, status management, and completion tracking
- **Goal States**: "in_progress" and "completed" status tracking
- **Chat Integration**: Goals are associated with Telegram chat IDs

### Telegram Bot Features
- **Goal Creation**: `/newgoal <title>` command for creating group goals
- **Goal Listing**: `/goals` command to view active goals
- **Goal Completion**: `/complete <id>` command to mark goals as complete
- **Help System**: `/help` command with usage instructions

### API Endpoints
- `GET /api/bot/status` - Bot health check and status monitoring
- `GET /api/goals` - Retrieve goals by chat ID for web interface

### Frontend Components
- **Bot Status Dashboard**: Real-time monitoring of bot status with auto-refresh
- **shadcn/ui Integration**: Complete UI component library for consistent design
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Data Flow

1. **Telegram Commands**: Users interact with bot through Telegram commands
2. **Bot Processing**: GoalBot processes commands and updates database
3. **Database Operations**: Goals and user data stored in PostgreSQL
4. **Status Monitoring**: Web interface polls bot status via REST API
5. **Real-time Updates**: Frontend auto-refreshes every 10 seconds

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless database connectivity
- **node-telegram-bot-api**: Telegram Bot API client
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/**: Component primitives for accessible UI
- **tailwindcss**: Utility-first CSS framework

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `TELEGRAM_BOT_TOKEN` or `BOT_TOKEN`: Telegram bot authentication token (required)

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations applied via `db:push` command

### Development vs Production
- **Development**: Uses Vite dev server with HMR and error overlay
- **Production**: Serves static files from Express with fallback routing
- **Database Migrations**: Schema changes deployed via Drizzle Kit

### Replit Integration
- Custom Vite plugins for Replit development environment
- Runtime error modal for better debugging experience
- Cartographer integration for enhanced development tools

## Changelog
- July 04, 2025: Initial setup with in-memory storage
- July 04, 2025: Added PostgreSQL database with Drizzle ORM integration
- July 04, 2025: Added one-click deployment configuration with Docker, deployment guides, and platform-ready setup
- July 04, 2025: Optimized for Railway deployment - removed Docker files, simplified README and deploy.md, added railway.json configuration
- July 05, 2025: Cleaned up project - removed all unnecessary documentation files, build artifacts, and simplified for Railway-only deployment

## User Preferences

Preferred communication style: Simple, everyday language.