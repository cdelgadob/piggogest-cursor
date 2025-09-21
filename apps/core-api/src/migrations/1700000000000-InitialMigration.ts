import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1700000000000 implements MigrationInterface {
    name = 'InitialMigration1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create clientes table
        await queryRunner.query(`
            CREATE TABLE "clientes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "nombre" character varying(255) NOT NULL,
                "apellido" character varying(255) NOT NULL,
                "email" character varying(255) NOT NULL,
                "telefono" character varying(20) NOT NULL,
                "documento" character varying(20) NOT NULL,
                "tipoDocumento" character varying(50) NOT NULL,
                "direccion" text,
                "ciudad" character varying(100),
                "pais" character varying(100),
                "codigoPostal" character varying(20),
                "activo" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_clientes_email" UNIQUE ("email"),
                CONSTRAINT "UQ_clientes_telefono" UNIQUE ("telefono"),
                CONSTRAINT "UQ_clientes_documento" UNIQUE ("documento"),
                CONSTRAINT "PK_clientes" PRIMARY KEY ("id")
            )
        `);

        // Create tramites_catalogo table
        await queryRunner.query(`
            CREATE TABLE "tramites_catalogo" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "nombre" character varying(255) NOT NULL,
                "descripcion" character varying(500) NOT NULL,
                "tipo" character varying NOT NULL,
                "version" character varying(50) NOT NULL,
                "estado" character varying NOT NULL DEFAULT 'activo',
                "pasos" json NOT NULL,
                "sla" json NOT NULL,
                "duracionEstimada" integer NOT NULL DEFAULT '0',
                "costo" numeric(10,2),
                "requisitos" json,
                "configuracion" json,
                "activo" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_tramites_catalogo" PRIMARY KEY ("id")
            )
        `);

        // Create expedientes table
        await queryRunner.query(`
            CREATE TABLE "expedientes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "numeroExpediente" character varying(50) NOT NULL,
                "estado" character varying NOT NULL DEFAULT 'pendiente',
                "descripcion" text,
                "datosAdicionales" json,
                "fechaInicio" date,
                "fechaVencimiento" date,
                "fechaCompletado" date,
                "progreso" integer,
                "responsable" character varying(255),
                "observaciones" text,
                "activo" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "clienteId" uuid NOT NULL,
                "tramiteCatalogoId" uuid NOT NULL,
                CONSTRAINT "UQ_expedientes_numeroExpediente" UNIQUE ("numeroExpediente"),
                CONSTRAINT "PK_expedientes" PRIMARY KEY ("id")
            )
        `);

        // Create documentos_referencia table
        await queryRunner.query(`
            CREATE TABLE "documentos_referencia" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "nombre" character varying(255) NOT NULL,
                "descripcion" character varying(500) NOT NULL,
                "tipo" character varying NOT NULL,
                "estado" character varying NOT NULL DEFAULT 'pendiente',
                "urlArchivo" character varying(500),
                "nombreArchivo" character varying(100),
                "tipoArchivo" character varying(50),
                "tamanoArchivo" bigint,
                "hashArchivo" character varying(255),
                "fechaVencimiento" date,
                "esObligatorio" boolean NOT NULL DEFAULT false,
                "orden" integer,
                "observaciones" text,
                "metadatos" json,
                "activo" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "expedienteId" uuid NOT NULL,
                CONSTRAINT "PK_documentos_referencia" PRIMARY KEY ("id")
            )
        `);

        // Create eventos_expediente table
        await queryRunner.query(`
            CREATE TABLE "eventos_expediente" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "tipo" character varying NOT NULL,
                "nivel" character varying NOT NULL DEFAULT 'info',
                "titulo" character varying(255) NOT NULL,
                "descripcion" text NOT NULL,
                "usuario" character varying(255),
                "sistema" character varying(255),
                "datosAdicionales" json,
                "esAutomatico" boolean NOT NULL DEFAULT false,
                "requiereAtencion" boolean NOT NULL DEFAULT false,
                "accionRequerida" character varying(255),
                "fechaVencimiento" date,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "expedienteId" uuid NOT NULL,
                CONSTRAINT "PK_eventos_expediente" PRIMARY KEY ("id")
            )
        `);

        // Add foreign key constraints
        await queryRunner.query(`
            ALTER TABLE "expedientes" 
            ADD CONSTRAINT "FK_expedientes_clienteId" 
            FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "expedientes" 
            ADD CONSTRAINT "FK_expedientes_tramiteCatalogoId" 
            FOREIGN KEY ("tramiteCatalogoId") REFERENCES "tramites_catalogo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "documentos_referencia" 
            ADD CONSTRAINT "FK_documentos_referencia_expedienteId" 
            FOREIGN KEY ("expedienteId") REFERENCES "expedientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "eventos_expediente" 
            ADD CONSTRAINT "FK_eventos_expediente_expedienteId" 
            FOREIGN KEY ("expedienteId") REFERENCES "expedientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        // Create indexes for better performance
        await queryRunner.query(`CREATE INDEX "IDX_expedientes_clienteId" ON "expedientes" ("clienteId")`);
        await queryRunner.query(`CREATE INDEX "IDX_expedientes_tramiteCatalogoId" ON "expedientes" ("tramiteCatalogoId")`);
        await queryRunner.query(`CREATE INDEX "IDX_expedientes_estado" ON "expedientes" ("estado")`);
        await queryRunner.query(`CREATE INDEX "IDX_documentos_referencia_expedienteId" ON "documentos_referencia" ("expedienteId")`);
        await queryRunner.query(`CREATE INDEX "IDX_eventos_expediente_expedienteId" ON "eventos_expediente" ("expedienteId")`);
        await queryRunner.query(`CREATE INDEX "IDX_eventos_expediente_tipo" ON "eventos_expediente" ("tipo")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`DROP INDEX "IDX_eventos_expediente_tipo"`);
        await queryRunner.query(`DROP INDEX "IDX_eventos_expediente_expedienteId"`);
        await queryRunner.query(`DROP INDEX "IDX_documentos_referencia_expedienteId"`);
        await queryRunner.query(`DROP INDEX "IDX_expedientes_estado"`);
        await queryRunner.query(`DROP INDEX "IDX_expedientes_tramiteCatalogoId"`);
        await queryRunner.query(`DROP INDEX "IDX_expedientes_clienteId"`);

        // Drop foreign key constraints
        await queryRunner.query(`ALTER TABLE "eventos_expediente" DROP CONSTRAINT "FK_eventos_expediente_expedienteId"`);
        await queryRunner.query(`ALTER TABLE "documentos_referencia" DROP CONSTRAINT "FK_documentos_referencia_expedienteId"`);
        await queryRunner.query(`ALTER TABLE "expedientes" DROP CONSTRAINT "FK_expedientes_tramiteCatalogoId"`);
        await queryRunner.query(`ALTER TABLE "expedientes" DROP CONSTRAINT "FK_expedientes_clienteId"`);

        // Drop tables
        await queryRunner.query(`DROP TABLE "eventos_expediente"`);
        await queryRunner.query(`DROP TABLE "documentos_referencia"`);
        await queryRunner.query(`DROP TABLE "expedientes"`);
        await queryRunner.query(`DROP TABLE "tramites_catalogo"`);
        await queryRunner.query(`DROP TABLE "clientes"`);
    }
}