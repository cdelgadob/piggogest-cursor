export interface Expediente {
  id: string;
  estado: 'Pendiente' | 'En Proceso' | 'Completado' | 'Cancelado';
  cliente: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  descripcion?: string;
}