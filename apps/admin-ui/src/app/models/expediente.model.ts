export enum EstadoExpediente {
  PENDIENTE = 'pendiente',
  EN_PROCESO = 'en_proceso',
  COMPLETADO = 'completado',
  CANCELADO = 'cancelado',
  RECHAZADO = 'rechazado'
}

export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  documento: string;
  tipoDocumento: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  codigoPostal?: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TramiteCatalogo {
  id: string;
  nombre: string;
  descripcion: string;
  categoria?: string;
  tiempoEstimado?: number;
  requisitos?: string[];
}

export interface DocumentoReferencia {
  id: string;
  nombre: string;
  tipo: string;
  url: string;
  fechaSubida: Date;
  verificado: boolean;
  observaciones?: string;
}

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

export interface EventoExpediente {
  id: string;
  tipo: TipoEvento;
  nivel: NivelEvento;
  titulo: string;
  descripcion: string;
  usuario?: string;
  sistema?: string;
  datosAdicionales?: any;
  esAutomatico: boolean;
  requiereAtencion: boolean;
  accionRequerida?: string;
  fechaVencimiento?: Date;
  createdAt: Date;
}

export interface Expediente {
  id: string;
  numeroExpediente: string;
  estado: EstadoExpediente;
  descripcion?: string;
  datosAdicionales?: any;
  fechaInicio?: Date;
  fechaVencimiento?: Date;
  fechaCompletado?: Date;
  progreso?: number;
  responsable?: string;
  observaciones?: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
  cliente: Cliente;
  tramiteCatalogo: TramiteCatalogo;
  documentos?: DocumentoReferencia[];
  eventos?: EventoExpediente[];
}