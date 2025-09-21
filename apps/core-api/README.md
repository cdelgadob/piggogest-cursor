# Core API

A NestJS application with GraphQL, health checks, metrics, logging, and distributed tracing.

## Features

- **NestJS** with TypeScript
- **GraphQL** with Apollo Server
- **Health Checks** at `/healthz`
- **Metrics** at `/metrics` with Prometheus
- **JSON Logging** with Pino
- **Distributed Tracing** with OpenTelemetry
- **CORS** support
- **Validation** with class-validator

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run start:dev
```

## Endpoints

- **GraphQL Playground**: http://localhost:3000/graphql
- **Health Check**: http://localhost:3000/healthz
- **Metrics**: http://localhost:3000/metrics

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `NODE_ENV` | development | Environment |
| `LOG_LEVEL` | info | Log level |
| `CORS_ORIGIN` | * | CORS origin |
| `JAEGER_ENDPOINT` | http://localhost:14268/api/traces | Jaeger endpoint |
| `METRICS_PORT` | 9464 | Metrics port |

## Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with watch
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build the application
- `npm run test` - Run tests
- `npm run lint` - Run linter

## Monitoring

The application includes:

- **Health checks** for service monitoring
- **Prometheus metrics** for observability
- **Structured JSON logging** with Pino
- **Distributed tracing** with OpenTelemetry and Jaeger

## GraphQL Schema

The application exposes a simple GraphQL schema with:

- `appInfo` query - Returns application information
- `hello` query - Returns a greeting message