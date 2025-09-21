import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpedientesService } from '../../services/expedientes.service';
import { Expediente } from '../../models/expediente.model';

@Component({
  selector: 'app-expedientes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="expedientes-container">
      <div class="card">
        <div class="card-header">
          <h2>📁 Gestión de Expedientes</h2>
          <p>Lista de expedientes del sistema</p>
        </div>
        
        <div class="card-content">
          <div *ngIf="isLoading" class="loading-container">
            <div class="spinner"></div>
            <p>Cargando expedientes...</p>
          </div>
          
          <div *ngIf="!isLoading" class="table-container">
            <table class="expedientes-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Estado</th>
                  <th>Cliente</th>
                  <th>Fecha Creación</th>
                  <th>Fecha Actualización</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let expediente of expedientes">
                  <td class="id-cell">{{ expediente.id }}</td>
                  <td>
                    <span class="status-badge" [ngClass]="getStatusClass(expediente.estado)">
                      {{ expediente.estado }}
                    </span>
                  </td>
                  <td class="client-cell">{{ expediente.cliente }}</td>
                  <td>{{ formatDate(expediente.fechaCreacion) }}</td>
                  <td>{{ formatDate(expediente.fechaActualizacion) }}</td>
                  <td class="description-cell">{{ expediente.descripcion }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .expedientes-container {
      padding: 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem;
    }
    
    .card-header h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
    }
    
    .card-header p {
      margin: 0;
      opacity: 0.9;
    }
    
    .card-content {
      padding: 1.5rem;
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .table-container {
      overflow-x: auto;
    }
    
    .expedientes-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }
    
    .expedientes-table th,
    .expedientes-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .expedientes-table th {
      background-color: #f5f5f5;
      font-weight: 600;
      color: #333;
    }
    
    .expedientes-table tbody tr:hover {
      background-color: #f9f9f9;
    }
    
    .id-cell {
      font-weight: bold;
      color: #667eea;
    }
    
    .client-cell {
      font-weight: 500;
    }
    
    .description-cell {
      max-width: 300px;
      word-wrap: break-word;
      line-height: 1.4;
    }
    
    .status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }
    
    .status-pendiente {
      background-color: #ff9800;
      color: white;
    }
    
    .status-en-proceso {
      background-color: #2196f3;
      color: white;
    }
    
    .status-completado {
      background-color: #4caf50;
      color: white;
    }
    
    .status-cancelado {
      background-color: #f44336;
      color: white;
    }
  `]
})
export class ExpedientesComponent implements OnInit {
  expedientes: Expediente[] = [];
  isLoading = true;

  constructor(private expedientesService: ExpedientesService) {}

  ngOnInit() {
    this.loadExpedientes();
  }

  loadExpedientes() {
    this.isLoading = true;
    this.expedientesService.getExpedientes().subscribe({
      next: (expedientes) => {
        this.expedientes = expedientes;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading expedientes:', error);
        this.isLoading = false;
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pendiente':
        return 'status-pendiente';
      case 'En Proceso':
        return 'status-en-proceso';
      case 'Completado':
        return 'status-completado';
      case 'Cancelado':
        return 'status-cancelado';
      default:
        return 'status-pendiente';
    }
  }
}