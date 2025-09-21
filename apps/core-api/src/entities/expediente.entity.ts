import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Cliente } from './cliente.entity';
import { TramiteCatalogo } from './tramite-catalogo.entity';
import { DocumentoReferencia } from './documento-referencia.entity';
import { EventoExpediente } from './evento-expediente.entity';

export enum EstadoExpediente {
  PENDIENTE = 'pendiente',
  EN_PROCESO = 'en_proceso',
  COMPLETADO = 'completado',
  CANCELADO = 'cancelado',
  RECHAZADO = 'rechazado'
}

@Entity('expedientes')
export class Expediente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  numeroExpediente: string;

  @Column({ type: 'enum', enum: EstadoExpediente, default: EstadoExpediente.PENDIENTE })
  estado: EstadoExpediente;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'json', nullable: true })
  datosAdicionales: any;

  @Column({ type: 'date', nullable: true })
  fechaInicio: Date;

  @Column({ type: 'date', nullable: true })
  fechaVencimiento: Date;

  @Column({ type: 'date', nullable: true })
  fechaCompletado: Date;

  @Column({ type: 'int', nullable: true })
  progreso: number; // 0-100

  @Column({ type: 'varchar', length: 255, nullable: true })
  responsable: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Cliente, cliente => cliente.expedientes)
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;

  @Column({ type: 'uuid' })
  clienteId: string;

  @ManyToOne(() => TramiteCatalogo, tramite => tramite.expedientes)
  @JoinColumn({ name: 'tramiteCatalogoId' })
  tramiteCatalogo: TramiteCatalogo;

  @Column({ type: 'uuid' })
  tramiteCatalogoId: string;

  @OneToMany(() => DocumentoReferencia, documento => documento.expediente)
  documentos: DocumentoReferencia[];

  @OneToMany(() => EventoExpediente, evento => evento.expediente)
  eventos: EventoExpediente[];
}