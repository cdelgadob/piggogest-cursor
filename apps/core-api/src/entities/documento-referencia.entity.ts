import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Expediente } from './expediente.entity';

export enum TipoDocumento {
  IDENTIFICACION = 'identificacion',
  COMPROBANTE = 'comprobante',
  CONTRATO = 'contrato',
  CERTIFICADO = 'certificado',
  OTRO = 'otro'
}

export enum EstadoDocumento {
  PENDIENTE = 'pendiente',
  RECIBIDO = 'recibido',
  VERIFICADO = 'verificado',
  RECHAZADO = 'rechazado'
}

@Entity('documentos_referencia')
export class DocumentoReferencia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 500 })
  descripcion: string;

  @Column({ type: 'enum', enum: TipoDocumento })
  tipo: TipoDocumento;

  @Column({ type: 'enum', enum: EstadoDocumento, default: EstadoDocumento.PENDIENTE })
  estado: EstadoDocumento;

  @Column({ type: 'varchar', length: 500, nullable: true })
  urlArchivo: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nombreArchivo: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tipoArchivo: string;

  @Column({ type: 'bigint', nullable: true })
  tamanoArchivo: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  hashArchivo: string;

  @Column({ type: 'date', nullable: true })
  fechaVencimiento: Date;

  @Column({ type: 'boolean', default: false })
  esObligatorio: boolean;

  @Column({ type: 'int', nullable: true })
  orden: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ type: 'json', nullable: true })
  metadatos: any;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Expediente, expediente => expediente.documentos)
  @JoinColumn({ name: 'expedienteId' })
  expediente: Expediente;

  @Column({ type: 'uuid' })
  expedienteId: string;
}