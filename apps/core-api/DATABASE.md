# Database Setup and Management

This document describes the database entities, migrations, and seed data for the Expedientes system.

## Entities

The system includes the following main entities:

### 1. Cliente
- **Purpose**: Stores client information
- **Key Fields**: nombre, apellido, email, telefono, documento, tipoDocumento
- **Relationships**: One-to-many with Expediente

### 2. TramiteCatalogo
- **Purpose**: Defines available procedures/tramites with their steps and SLA
- **Key Fields**: nombre, descripcion, tipo, version, pasos, sla, requisitos
- **Types**: TRANSFERENCIA, APERTURA, CIERRE, MODIFICACION
- **Relationships**: One-to-many with Expediente

### 3. Expediente
- **Purpose**: Main case file that tracks the progress of a tramite
- **Key Fields**: numeroExpediente, estado, descripcion, progreso, responsable
- **States**: PENDIENTE, EN_PROCESO, COMPLETADO, CANCELADO, RECHAZADO
- **Relationships**: Many-to-one with Cliente and TramiteCatalogo, One-to-many with DocumentoReferencia and EventoExpediente

### 4. DocumentoReferencia
- **Purpose**: Tracks documents required and submitted for each expediente
- **Key Fields**: nombre, descripcion, tipo, estado, urlArchivo, esObligatorio
- **Types**: IDENTIFICACION, COMPROBANTE, CONTRATO, CERTIFICADO, OTRO
- **States**: PENDIENTE, RECIBIDO, VERIFICADO, RECHAZADO
- **Relationships**: Many-to-one with Expediente

### 5. EventoExpediente
- **Purpose**: Audit trail of all events and actions in an expediente
- **Key Fields**: tipo, nivel, titulo, descripcion, usuario, esAutomatico
- **Types**: CREACION, ACTUALIZACION, CAMBIO_ESTADO, DOCUMENTO_SUBIDO, etc.
- **Levels**: INFO, WARNING, ERROR, SUCCESS
- **Relationships**: Many-to-one with Expediente

## Migrations

### Running Migrations

```bash
# Generate a new migration (after entity changes)
npm run migration:generate -- src/migrations/MigrationName

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Create empty migration file
npm run migration:create -- src/migrations/MigrationName
```

### Initial Migration

The initial migration (`1700000000000-InitialMigration.ts`) creates all tables with:
- Proper foreign key constraints
- Indexes for performance
- Unique constraints where needed
- JSON columns for flexible data storage

## Seeds

### Transferencia v1.0 Seed

The system includes a comprehensive seed for a "Transferencia de Propiedad" tramite with:

#### Steps
1. **Recepción de Documentos** (2 days)
2. **Verificación Legal** (5 days)
3. **Inspección del Inmueble** (3 days)
4. **Avalúo Comercial** (7 days)
5. **Procesamiento de Impuestos** (3 days)
6. **Registro Oficial** (10 days)

#### SLA Configuration
- **General**: 30 days maximum, 20 days target, 95% service level
- **Per Step**: Individual SLA for each step
- **Escalation**: 3-level escalation system
- **Notifications**: Client and responsible party notifications

#### Requirements
- Cédula de Identidad
- Título de Propiedad
- Certificado de Libertad
- Certificado de Paz y Salvo
- Contrato de Compraventa
- Avalúo Comercial

### Running Seeds

```bash
# Run all seeds
npm run seed:run
```

## Database Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=expedientes_db
NODE_ENV=development
```

### TypeORM Configuration

The database configuration is in `src/database/database.module.ts` and uses:
- PostgreSQL as the database
- Environment-based configuration
- Automatic synchronization in development
- Migration support for production

## Usage Examples

### Creating a New Expediente

```typescript
const expediente = new Expediente();
expediente.numeroExpediente = 'EXP-2024-001';
expediente.estado = EstadoExpediente.PENDIENTE;
expediente.clienteId = clienteId;
expediente.tramiteCatalogoId = tramiteId;
await expedienteRepository.save(expediente);
```

### Adding a Document

```typescript
const documento = new DocumentoReferencia();
documento.nombre = 'Cédula de Identidad';
documento.tipo = TipoDocumento.IDENTIFICACION;
documento.estado = EstadoDocumento.RECIBIDO;
documento.expedienteId = expedienteId;
documento.esObligatorio = true;
await documentoRepository.save(documento);
```

### Recording an Event

```typescript
const evento = new EventoExpediente();
evento.tipo = TipoEvento.DOCUMENTO_SUBIDO;
evento.nivel = NivelEvento.INFO;
evento.titulo = 'Documento subido';
evento.descripcion = 'Se ha subido la cédula de identidad';
evento.expedienteId = expedienteId;
evento.usuario = 'usuario@email.com';
await eventoRepository.save(evento);
```

## Performance Considerations

- Indexes are created on frequently queried fields
- JSON columns are used for flexible data storage
- Foreign key constraints ensure data integrity
- Proper relationship mapping for efficient queries

## Security Notes

- All sensitive data should be encrypted at rest
- File uploads should be validated and scanned
- Database connections should use SSL in production
- Regular backups should be configured