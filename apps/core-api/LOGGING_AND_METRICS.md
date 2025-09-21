# Logging y Métricas - Core API

Este documento describe la implementación de logging estructurado JSON y métricas con OpenTelemetry en la Core API.

## Características Implementadas

### 1. Logging Estructurado JSON

#### Campos Estructurados
- `nivel`: Nivel del log (info, error, warn, debug, trace)
- `servicio`: Nombre del servicio (core-api)
- `expedienteId`: ID del expediente relacionado (cuando aplica)
- `cliente`: Nombre del cliente (cuando aplica)
- `traceId`: ID de traza de OpenTelemetry
- `spanId`: ID de span de OpenTelemetry
- `time`: Timestamp ISO 8601
- `context`: Contexto adicional (HTTP, GraphQL, OCR, etc.)

#### Ejemplo de Log Estructurado
```json
{
  "nivel": "info",
  "servicio": "core-api",
  "expedienteId": "exp-123",
  "cliente": "Juan Pérez",
  "traceId": "abc123def456",
  "spanId": "def456ghi789",
  "time": "2024-01-15T10:30:00.000Z",
  "context": "GraphQL",
  "operation": "createExpediente",
  "message": "Expediente created successfully"
}
```

### 2. OpenTelemetry Instrumentación

#### Exportadores Configurados
- **Jaeger**: Para traces (endpoint: `http://localhost:14268/api/traces`)
- **OTLP HTTP**: Para traces y métricas (endpoints configurables)
- **Prometheus**: Para métricas (puerto 9464, endpoint `/metrics`)

#### Variables de Entorno
```bash
# OTLP Configuration
OTLP_TRACES_ENDPOINT=http://localhost:4318/v1/traces
OTLP_METRICS_ENDPOINT=http://localhost:4318/v1/metrics

# Jaeger (legacy)
JAEGER_ENDPOINT=http://localhost:14268/api/traces

# Metrics
METRICS_PORT=9464
```

### 3. Métricas Personalizadas

#### Métricas Implementadas

1. **Latencia GraphQL** (`graphql_request_duration_ms`)
   - Tipo: Histograma
   - Unidad: milisegundos
   - Labels: `operation`, `success`

2. **Expedientes Creados** (`expedientes_created_total`)
   - Tipo: Contador
   - Labels: `expedienteId`, `cliente`

3. **Errores OCR** (`ocr_errors_total`)
   - Tipo: Contador
   - Labels: `expedienteId`, `errorType`

#### Ejemplo de Uso de Métricas
```typescript
// Incrementar contador de expedientes creados
this.metricsService.incrementExpedientesCreated(expedienteId, cliente);

// Registrar latencia GraphQL
this.metricsService.recordGraphQLLatency('createExpediente', duration, true);

// Incrementar contador de errores OCR
this.metricsService.incrementOCRErrors(expedienteId, 'parsing_error', 'Invalid format');
```

### 4. Interceptores

#### PinoHttpInterceptor
- Intercepta requests HTTP
- Extrae `expedienteId` y `cliente` de body/query params
- Incluye contexto de OpenTelemetry en logs
- Registra duración de requests

#### GraphQLMetricsInterceptor
- Intercepta operaciones GraphQL
- Mide latencia de operaciones
- Extrae contexto de GraphQL (operation, field)
- Registra métricas de latencia automáticamente

### 5. Servicios de Logging

#### PinoLoggerService
```typescript
// Logging básico
this.logger.log('Mensaje', 'Contexto');

// Logging estructurado
this.logger.logWithContext('Mensaje', {
  nivel: 'info',
  servicio: 'core-api',
  expedienteId: 'exp-123',
  cliente: 'Juan Pérez',
  context: 'GraphQL'
});
```

### 6. Endpoints Disponibles

- **Health Check**: `GET /healthz`
- **Métricas Prometheus**: `GET /metrics`
- **GraphQL Playground**: `GET /graphql` (solo en desarrollo)

### 7. Configuración de Desarrollo

#### Instalar Dependencias
```bash
cd apps/core-api
npm install
```

#### Variables de Entorno
Copiar `.env.example` a `.env` y configurar:
```bash
cp .env.example .env
```

#### Ejecutar en Desarrollo
```bash
npm run start:dev
```

### 8. Monitoreo y Observabilidad

#### Logs Estructurados
Los logs se generan en formato JSON estructurado, ideales para:
- Elasticsearch/ELK Stack
- Fluentd/Fluent Bit
- CloudWatch Logs
- Datadog Logs

#### Métricas
Las métricas se exportan en formato Prometheus y OTLP:
- **Prometheus**: Para scraping y alertas
- **OTLP**: Para sistemas como Jaeger, Zipkin, DataDog, New Relic

#### Traces
Los traces incluyen:
- Información de requests HTTP
- Operaciones GraphQL
- Contexto de base de datos
- Spans personalizados

### 9. Ejemplos de Uso

#### Crear Expediente con Logging
```graphql
mutation {
  createExpediente(
    clienteId: "cliente-123"
    tramiteId: "tramite-456"
    descripcion: "Expediente de prueba"
  ) {
    id
    descripcion
    cliente {
      nombre
    }
  }
}
```

#### Simular Error OCR
```graphql
mutation {
  simulateOCRError(
    expedienteId: "exp-123"
    errorType: "parsing_error"
    errorMessage: "Invalid document format"
  )
}
```

### 10. Mejores Prácticas

1. **Logging**:
   - Usar `logWithContext` para logs estructurados
   - Incluir `expedienteId` y `cliente` cuando sea relevante
   - Usar niveles apropiados (info, warn, error)

2. **Métricas**:
   - Registrar métricas en puntos clave del negocio
   - Usar labels descriptivos
   - Evitar cardinalidad alta en labels

3. **Traces**:
   - Los traces se generan automáticamente
   - Usar spans personalizados para operaciones críticas
   - Mantener traces ligeros (evitar datos sensibles)

### 11. Troubleshooting

#### Logs No Aparecen
- Verificar `LOG_LEVEL` en variables de entorno
- Comprobar configuración de Pino

#### Métricas No Se Exportan
- Verificar conectividad con OTLP endpoint
- Comprobar configuración de Prometheus
- Revisar logs de OpenTelemetry

#### Traces No Aparecen
- Verificar configuración de Jaeger/OTLP
- Comprobar que OpenTelemetry se inicializa correctamente
- Revisar logs de inicialización