PiggoGest – Plan de Implementación por Fases (Core API + n8n + Admin + Reporting)

Objetivo: lanzar PiggoGest como gestoría B2B especializada (concesionarios/VO) con núcleo API ligero en NestJS, automatización con n8n, panel de administración/observabilidad, y reporting básico en el Admin (AG Grid), minimizando código ad hoc y coste operativo.

0) Decisiones de base

Stack sugerido

Backend: NestJS (Node.js 22 LTS, TypeScript) con GraphQL (Apollo) desplegado en Azure Container Apps (ACA). Compatible con serverless a futuro.

Persistencia: Cosmos DB (operacional) + Azure SQL Serverless (histórico/reporting). CDC/ETL con n8n.

Automatización: n8n self-hosted en ACA, workflows versionados en repo.

OCR/IA: Azure Form Recognizer (provider pluggable).

Almacenamiento documentos: apoyarse en gestor documental externo. Fallback en Azure Blob Storage con StorageProvider pluggable (Blob|S3).

Observabilidad: OpenTelemetry + Azure Monitor (Grafana opcional).

Admin UI: Angular + AG Grid (MVP rápido, migrable a React Admin a futuro).

Auth: Auth0 (pluggable, interfaz AuthService para migrar a AAD B2C si conviene).

Infra: Terraform + Docker, CI/CD GitHub Actions.

Principios

CoreAPI = fuente única de verdad (estado y referencias, no almacena documentos pesados).

n8n = motor de orquestación y conectores (gestor documental/ERP/DMS, OCR, notificaciones).

Parametrización > código: catálogo de trámites configurable (pasos, reglas, SLA).

Eventos de dominio: cambios de estado emiten eventos; nada se “oculta” en jobs negros.

1) Entornos PiggoGest

Local: desarrollo en portátil, docker-compose para Postgres+n8n.

Dev: ACA (dev tier), Cosmos dev, Blob dev, Auth0 dev tenant.

Staging (demos/UAT): ACA (con sizing prod reducido), Cosmos stg, SQL stg, Auth0 stg tenant, acceso limitado.

Producción: ACA multi-zone, Cosmos prod, SQL serverless prod, Blob prod, Auth0 prod tenant, observabilidad y alertas completas.

Naming estándar:

api.dev.piggogest.com, admin.dev.piggogest.com, n8n.dev.piggogest.com

api.stg.piggogest.com, admin.stg.piggogest.com, …

api.piggogest.com, admin.piggogest.com

2) Fases y entregables (Roadmap 0–12 semanas)
Fase 0 – Fundaciones (Semana 0–1)

Monorepo con estructura PiggoGest:

piggogest/
  apps/core-api/
  apps/admin-ui/
  apps/n8n/
  packages/shared/
  infra/terraform/
  docs/

ACA dev provisionado con Terraform.

CoreAPI NestJS básico: /healthz, /metrics (Prometheus), tracing OTEL.

n8n desplegado (dev) con workflow “hello”.

CI/CD GitHub Actions mínima (lint, test, deploy-dev).

Fase 1 – MVP Integración y Estados (Semana 2–4)

Endpoint POST /expedientes/intake (GraphQL mutation) recibe trigger externo.

Modelo de datos mínimo: expediente, documento_referencia, evento_expediente, cliente.

Catálogo de trámites parametrizable.

Workflow n8n PG_EXPD_INTAKE_VALIDATE:

Leer expediente (CoreAPI).

Consultar gestor documental.

Descarga documentos.

OCR (Form Recognizer).

Comparación reglas.

Actualizar estado en CoreAPI.

Callback cliente.

Admin UI v0: listado y detalle expedientes (AG Grid), timeline de eventos.

Fase 2 – Operación, Observabilidad y Notificaciones (Semana 5–8)

Admin UI v1: filtros, reasignación manual, forzar transición.

n8n: reintentos, notificaciones (email/Teams/WhatsApp) por SLA/errores.

Observabilidad: logs estructurados, tracing distribuido, tableros Azure Monitor/Grafana.

Seguridad: Auth0 dev/stg/prod tenants, RBAC por roles.

Fase 3 – Reporting básico (Semana 9–12)

Reporting en Admin (tablas AG Grid, KPIs básicos).

Export CSV/Excel desde Admin.

Datos históricos en Azure SQL serverless.

3) Modelo de datos

expediente: id, clienteId, tipoTramite, matricula, vin, estado, prioridad, slaHoras, timestamps.

documento_referencia: id, expedienteId, tipo, urlGestor, hash, ocrStatus, ocrVendor, ocrPayload.

evento_expediente: id, expedienteId, tipoEvento, payload, timestamp.

cliente: id, nombre, slug, webhookCallbackUrl, apiKeys, config.

tramite_catalogo: id, tipoTramite, version, pasos (jsonb), reglas (jsonb), slaHoras.

4) API GraphQL (extracto)
type Expediente {
  id: ID!
  clienteId: ID!
  tipoTramite: String!
  matricula: String!
  vin: String
  estado: String!
  eventos: [EventoExpediente!]!
}


input ExpedienteInput {
  clienteSlug: String!
  tipoTramite: String!
  expedienteExterno: String!
  vehiculo: VehiculoInput!
  personas: PersonasInput!
  documentos: [DocumentoInput!]!
}


mutation createExpediente(input: ExpedienteInput!): Expediente!
query expediente(id: ID!): Expediente
mutation transitionExpediente(id: ID!, estado: String!, motivo: String): Expediente
5) Workflows n8n (JSON versionados)

PG_EXPD_INTAKE_VALIDATE.json (expediente intake → OCR → validación → transición → callback).

PG_SLA_WATCHDOG.json (cron cada 5 min, detecta SLA vencidos, notifica y marca evento).

Versionado: /apps/n8n/workflows/*.json en repo, con control semántico (PG_EXPD_INTAKE_VALIDATE@1.0.0.json).

6) Observabilidad y seguridad

Logs: JSON estructurado (nivel, servicio, expedienteId, clienteSlug, evento, errorCode, latencyMs).

Tracing: OpenTelemetry, propagación traceparent.

Métricas: latencias, tasa error OCR, % revisión manual, tiempos por trámite.

Alertas: SLA incumplidos, error bursts.

Seguridad: Auth0 (dev/stg/prod tenants), API Keys por cliente, HMAC en callbacks, secretos en Azure Key Vault.

GDPR: minimización de datos, retención configurable, auditoría de accesos.

7) Reporting básico (MVP)

En vuelo: tablas AG Grid en Admin (expedientes activos, por estado/cliente, SLA pendientes).

Histórico inicial: queries sobre Azure SQL serverless.

Exportación: CSV/Excel descargable.

8) Infraestructura como código (Terraform)

Workspaces: dev, stg, prod.

Recursos: ACA (core-api, admin, n8n), Cosmos, SQL serverless, Blob, Key Vault, Monitor.

Outputs: URLs, secrets.

9) CI/CD (GitHub Actions)

Branch main → despliega a stg.

Tag release vX.Y.Z → despliega a prod.

PR → despliega a dev.

Jobs: lint, test, build, docker-publish, terraform-plan/apply.

10) Checklists aceptación por fase

F0: Healthz, métricas, n8n up, CI/CD ok.

F1: Trigger externo → validación automática/revisión manual con timeline visible.

F2: Alertas SLA, reasignación manual, RBAC, observabilidad completa.

F3: Reporting básico en Admin (AG Grid, export Excel).

11) Prompts útiles para Cursor/Codex

CoreAPI scaffold (NestJS): “Crea app NestJS (TS, Node 22) con GraphQL (Apollo), entidades expediente/documento/cliente, métricas Prometheus en /metrics, logs pino JSON, OTEL tracing.”

Models + migrations: “Define entidades expediente, documentoReferencia, eventoExpediente, cliente, tramiteCatalogo. Añade seed con un trámite ejemplo (transferencia v1 con pasos y SLA).”

Webhook intake: “Implementa mutation GraphQL createExpediente validando input, creando expediente y evento inicial, responde con id. Añade callback HMAC firmado.”

Admin UI: “Crea app Angular con login Auth0, AG Grid para lista de expedientes, detalle con timeline, filtros por estado/cliente, botones de transición.”

n8n workflow: “Crea workflow intake-validación: Webhook→HTTP(CoreAPI)→ForEach docs→HTTP(download)→OCR(Form Recognizer)→Validar→HTTP(CoreAPI transition)→HTTP(callback). Exporta JSON.”

Terraform: “Provisiona ACA (core-api, admin, n8n), Cosmos, SQL serverless, Blob, Key Vault, Monitor. Outputs con URLs y secrets.”

12) Variables de entorno PiggoGest (ejemplo)
APP_NAME=PiggoGest
APP_ENV=dev
PORT=3000


# Auth
AUTH_PROVIDER=auth0
AUTH0_DOMAIN=piggogest-dev.eu.auth0.com
AUTH0_CLIENT_ID=...
AUTH0_CLIENT_SECRET=...


# DB
COSMOSDB_URL=...
AZURE_SQL_URL=...


# Storage
STORAGE_PROVIDER=azure_blob
BLOB_CONNECTION_STRING=...


# OCR
OCR_PROVIDER=azure_form_recognizer
OCR_ENDPOINT=...
OCR_KEY=...


# Callbacks
CALLBACK_SIGNING_KEY=...


# Observability
OTEL_EXPORTER_OTLP_ENDPOINT=...
13) Riesgos y mitigaciones

OCR impreciso → umbral confianza + revisión manual + dataset mejora.

Dependencia gestor documental → StorageProvider pluggable.

Lock-in n8n → workflows versionados en repo.

Cambios legales → catálogo trámites parametrizado.

14) Próximos pasos

Aceptar stack definitivo (NestJS, Angular, n8n, Cosmos+SQL, Azure).

Configurar Terraform dev.

Scaffold CoreAPI + Admin v0 + n8n hello.

Implementar workflow intake + validación (F1).

Piloto con 1–2 concesionarios, refinar reglas y SLA.
