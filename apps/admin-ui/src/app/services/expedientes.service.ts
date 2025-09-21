import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Expediente } from '../models/expediente.model';

@Injectable({
  providedIn: 'root'
})
export class ExpedientesService {
  private expedientes: Expediente[] = [
    {
      id: 'EXP-001',
      estado: 'Pendiente',
      cliente: 'Juan Pérez',
      fechaCreacion: new Date('2024-01-15'),
      fechaActualizacion: new Date('2024-01-15'),
      descripcion: 'Expediente de consulta legal sobre propiedad'
    },
    {
      id: 'EXP-002',
      estado: 'En Proceso',
      cliente: 'María García',
      fechaCreacion: new Date('2024-01-10'),
      fechaActualizacion: new Date('2024-01-20'),
      descripcion: 'Proceso de divorcio'
    },
    {
      id: 'EXP-003',
      estado: 'Completado',
      cliente: 'Carlos López',
      fechaCreacion: new Date('2023-12-01'),
      fechaActualizacion: new Date('2024-01-05'),
      descripcion: 'Contrato de compraventa'
    },
    {
      id: 'EXP-004',
      estado: 'Pendiente',
      cliente: 'Ana Martínez',
      fechaCreacion: new Date('2024-01-22'),
      fechaActualizacion: new Date('2024-01-22'),
      descripcion: 'Testamento y sucesión'
    },
    {
      id: 'EXP-005',
      estado: 'En Proceso',
      cliente: 'Roberto Silva',
      fechaCreacion: new Date('2024-01-18'),
      fechaActualizacion: new Date('2024-01-25'),
      descripcion: 'Proceso laboral'
    },
    {
      id: 'EXP-006',
      estado: 'Cancelado',
      cliente: 'Laura Fernández',
      fechaCreacion: new Date('2023-11-15'),
      fechaActualizacion: new Date('2023-12-01'),
      descripcion: 'Consulta cancelada por el cliente'
    },
    {
      id: 'EXP-007',
      estado: 'Completado',
      cliente: 'Miguel Torres',
      fechaCreacion: new Date('2023-10-20'),
      fechaActualizacion: new Date('2023-12-15'),
      descripcion: 'Proceso penal'
    },
    {
      id: 'EXP-008',
      estado: 'Pendiente',
      cliente: 'Isabel Ruiz',
      fechaCreacion: new Date('2024-01-25'),
      fechaActualizacion: new Date('2024-01-25'),
      descripcion: 'Asesoría empresarial'
    }
  ];

  getExpedientes(): Observable<Expediente[]> {
    return of(this.expedientes);
  }

  getExpedienteById(id: string): Observable<Expediente | undefined> {
    const expediente = this.expedientes.find(exp => exp.id === id);
    return of(expediente);
  }
}