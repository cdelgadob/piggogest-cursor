# Piggogest Monorepo

A monorepo for the Piggogest project using pnpm workspaces.

## Structure

```
piggogest/
├── apps/
│   ├── core-api/          # Core API service (Express.js + TypeScript)
│   ├── admin-ui/          # Admin UI (React + Vite + TypeScript)
│   └── n8n/              # N8N workflows and configuration
├── packages/
│   └── shared/           # Shared utilities and types
├── infra/
│   └── terraform/        # Infrastructure as Code
├── docker-compose.yml    # Local development environment
└── pnpm-workspace.yaml   # pnpm workspace configuration
```

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker and Docker Compose

## Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start local development environment:**
   ```bash
   docker-compose up -d
   ```

3. **Start all applications in development mode:**
   ```bash
   pnpm dev
   ```

## Services

### Core API
- **Port:** 3000
- **Tech:** Express.js, TypeScript
- **Health check:** http://localhost:3000/health

### Admin UI
- **Port:** 3001
- **Tech:** React, Vite, TypeScript
- **URL:** http://localhost:3001

### N8N
- **Port:** 5678
- **URL:** http://localhost:5678
- **Credentials:** admin / admin123

### PostgreSQL
- **Port:** 5432
- **Databases:** piggogest_core, n8n
- **Credentials:** postgres / password

### PgAdmin (Optional)
- **Port:** 8080
- **URL:** http://localhost:8080
- **Credentials:** admin@piggogest.com / admin123

## Development

### Available Scripts

- `pnpm dev` - Start all applications in development mode
- `pnpm build` - Build all applications
- `pnpm test` - Run tests for all packages
- `pnpm lint` - Lint all packages
- `pnpm clean` - Clean build artifacts

### Working with Workspaces

- Install a dependency in a specific workspace:
  ```bash
  pnpm add <package> --filter @piggogest/core-api
  ```

- Run a script in a specific workspace:
  ```bash
  pnpm --filter @piggogest/core-api dev
  ```

- Add a dependency to all workspaces:
  ```bash
  pnpm add -w <package>
  ```

## Infrastructure

The `infra/terraform` directory contains Terraform configurations for AWS infrastructure. See the README in that directory for more details.

## Environment Variables

Copy `.env.example` to `.env` and configure your environment variables as needed.

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request