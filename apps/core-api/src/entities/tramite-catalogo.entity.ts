import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Expediente } from './expediente.entity';

export enum EstadoTramite {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  EN_DESARROLLO = 'en_desarrollo'
}

export enum TipoTramite {
  TRANSFERENCIA = 'transferencia',
  APERTURA = 'apertura',
  CIERRE = 'cierre',
  MODIFICACION = 'modificacion'
}

@Entity('tramites_catalogo')
export class TramiteCatalogo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 500 })
  descripcion: string;

  @Column({ type: 'enum', enum: TipoTramite })
  tipo: TipoTramite;

  @Column({ type: 'varchar', length: 50 })
  version: string;

  @Column({ type: 'enum', enum: EstadoTramite, default: EstadoTramite.ACTIVO })
  estado: EstadoTramite;

  @Column({ type: 'json' })
  pasos: any[]; // Array of step objects with name, description, order, etc.

  @Column({ type: 'json' })
  sla: any; // SLA configuration object

  @Column({ type: 'int', default: 0 })
  duracionEstimada: number; // in days

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  costo: number;

  @Column({ type: 'json', nullable: true })
  requisitos: any[]; // Array of required documents or conditions

  @Column({ type: 'json', nullable: true })
  configuracion: any; // Additional configuration

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Expediente, expediente => expediente.tramiteCatalogo)
  expedientes: Expediente[];
}