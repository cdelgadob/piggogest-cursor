import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Expediente } from './expediente.entity';

export enum TipoEvento {
  CREACION = 'creacion',
  ACTUALIZACION = 'actualizacion',
  CAMBIO_ESTADO = 'cambio_estado',
  DOCUMENTO_SUBIDO = 'documento_subido',
  DOCUMENTO_VERIFICADO = 'documento_verificado',
  NOTIFICACION = 'notificacion',
  ESCALACION = 'escalacion',
  COMPLETADO = 'completado',
  CANCELADO = 'cancelado',
  OTRO = 'otro'
}

export enum NivelEvento {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success'
}

@Entity('eventos_expediente')
export class EventoExpediente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TipoEvento })
  tipo: TipoEvento;

  @Column({ type: 'enum', enum: NivelEvento, default: NivelEvento.INFO })
  nivel: NivelEvento;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  usuario: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sistema: string;

  @Column({ type: 'json', nullable: true })
  datosAdicionales: any;

  @Column({ type: 'boolean', default: false })
  esAutomatico: boolean;

  @Column({ type: 'boolean', default: false })
  requiereAtencion: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  accionRequerida: string;

  @Column({ type: 'date', nullable: true })
  fechaVencimiento: Date;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => Expediente, expediente => expediente.eventos)
  @JoinColumn({ name: 'expedienteId' })
  expediente: Expediente;

  @Column({ type: 'uuid' })
  expedienteId: string;
}