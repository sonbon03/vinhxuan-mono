# Vinh Xuan CMS - Notary Management System

A comprehensive Content Management System for managing notary services, built with NestJS, React, and TypeScript in a monorepo architecture.

## 📁 Project Structure

```
vinhxuan-cms/
├── apps/
│   ├── backend/          # NestJS Backend API
│   └── frontend/         # React Frontend Application
├── packages/
│   └── shared/          # Shared types, utils, constants
├── package.json         # Root workspace configuration
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Yarn >= 1.22.0
- PostgreSQL >= 14.0
- Redis >= 6.0

### Installation

```bash
# Install all dependencies
yarn install

# Build shared package
yarn build:shared

# Start development servers
yarn dev
```

### Development

```bash
# Start backend only
yarn dev:backend

# Start frontend only
yarn dev:frontend

# Run tests
yarn test

# Lint code
yarn lint

# Format code
yarn format

# Type check
yarn typecheck
```

## 🏗️ Technology Stack

### Backend
- **NestJS 11** - Progressive Node.js framework
- **TypeORM** - ORM for PostgreSQL
- **PostgreSQL 14+** - Primary database
- **Redis 6+** - Caching and session storage
- **JWT** - Authentication

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Ant Design 5** - UI component library
- **TanStack React Query** - Data fetching
- **Zustand** - State management
- **React Hook Form + Zod** - Form handling
- **Tailwind CSS** - Utility-first CSS

### Shared
- **TypeScript 5.6+** - Type safety across stack
- **Shared types** - Type-safe API contracts

## 📚 Documentation

- [CLAUDE.md](../CLAUDE.md) - Project Requirements Document (PRD)
- [implementation-plan.md](../implementation-plan.md) - Implementation Plan

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start both backend and frontend |
| `yarn dev:backend` | Start backend only |
| `yarn dev:frontend` | Start frontend only |
| `yarn build` | Build all workspaces |
| `yarn test` | Run tests for all workspaces |
| `yarn lint` | Lint all code |
| `yarn format` | Format all code with Prettier |
| `yarn typecheck` | Type check all TypeScript code |
| `yarn clean` | Clean all build outputs and node_modules |

## 🌐 Endpoints

- **Backend API**: http://localhost:8830
- **API Documentation**: http://localhost:8830/api/docs
- **Frontend**: http://localhost:3000

## 📝 License

Proprietary - Vinh Xuan Legal Services Team

## 👥 Team

Maintained by Vinh Xuan Development Team

---

For detailed implementation instructions, see [implementation-plan.md](../implementation-plan.md)
