import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, GridApi, ColumnApi } from 'ag-grid-community';
import { ExpedientesService } from '../../services/expedientes.service';
import { Expediente, EstadoExpediente } from '../../models/expediente.model';

@Component({
  selector: 'app-expedientes',
  standalone: true,
  imports: [CommonModule, RouterModule, AgGridModule],
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
          
          <div *ngIf="!isLoading" class="ag-grid-container">
            <ag-grid-angular
              [rowData]="expedientes"
              [columnDefs]="columnDefs"
              [defaultColDef]="defaultColDef"
              [pagination]="true"
              [paginationPageSize]="20"
              [domLayout]="'autoHeight'"
              [rowSelection]="'single'"
              (gridReady)="onGridReady($event)"
              (rowClicked)="onRowClicked($event)"
              class="ag-theme-alpine">
            </ag-grid-angular>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .expedientes-container {
      padding: 1rem;
      max-width: 1400px;
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
    
    .ag-grid-container {
      width: 100%;
      height: 600px;
    }
    
    .ag-theme-alpine {
      --ag-header-background-color: #f8f9fa;
      --ag-header-foreground-color: #495057;
      --ag-border-color: #dee2e6;
      --ag-row-hover-color: #f8f9fa;
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
    
    .status-en_proceso {
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
    
    .status-rechazado {
      background-color: #9c27b0;
      color: white;
    }
    
    .expediente-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }
    
    .expediente-link:hover {
      text-decoration: underline;
    }
    
    .progress-bar {
      position: relative;
      width: 100%;
      height: 20px;
      background-color: #e0e0e0;
      border-radius: 10px;
      overflow: hidden;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4caf50, #8bc34a);
      transition: width 0.3s ease;
    }
    
    .progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 12px;
      font-weight: 500;
      color: #333;
    }
    
    .event-count {
      display: inline-block;
      background-color: #667eea;
      color: white;
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 500;
    }
  `]
})
export class ExpedientesComponent implements OnInit {
  expedientes: Expediente[] = [];
  isLoading = true;
  private gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;

  columnDefs: ColDef[] = [
    {
      headerName: 'Número',
      field: 'numeroExpediente',
      width: 150,
      pinned: 'left',
      cellRenderer: (params: any) => {
        return `<a href="/expedientes/${params.value}" class="expediente-link">${params.value}</a>`;
      }
    },
    {
      headerName: 'Estado',
      field: 'estado',
      width: 120,
      cellRenderer: (params: any) => {
        const statusClass = this.getStatusClass(params.value);
        return `<span class="status-badge ${statusClass}">${params.value}</span>`;
      }
    },
    {
      headerName: 'Cliente',
      field: 'cliente.nombre',
      width: 200,
      valueGetter: (params: any) => {
        return params.data?.cliente ? `${params.data.cliente.nombre} ${params.data.cliente.apellido}` : '';
      }
    },
    {
      headerName: 'Email',
      field: 'cliente.email',
      width: 200
    },
    {
      headerName: 'Trámite',
      field: 'tramiteCatalogo.nombre',
      width: 200
    },
    {
      headerName: 'Progreso',
      field: 'progreso',
      width: 100,
      cellRenderer: (params: any) => {
        const progress = params.value || 0;
        return `<div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
          <span class="progress-text">${progress}%</span>
        </div>`;
      }
    },
    {
      headerName: 'Responsable',
      field: 'responsable',
      width: 150
    },
    {
      headerName: 'Fecha Creación',
      field: 'createdAt',
      width: 120,
      valueFormatter: (params: any) => {
        return params.value ? new Date(params.value).toLocaleDateString('es-ES') : '';
      }
    },
    {
      headerName: 'Fecha Vencimiento',
      field: 'fechaVencimiento',
      width: 120,
      valueFormatter: (params: any) => {
        return params.value ? new Date(params.value).toLocaleDateString('es-ES') : '';
      }
    },
    {
      headerName: 'Eventos',
      field: 'eventos',
      width: 80,
      cellRenderer: (params: any) => {
        const eventCount = params.data?.eventos?.length || 0;
        return `<span class="event-count">${eventCount}</span>`;
      }
    }
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };

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

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onRowClicked(event: any) {
    const expedienteId = event.data.id;
    // Navigate to detail view
    window.location.href = `/expedientes/${expedienteId}`;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case EstadoExpediente.PENDIENTE:
        return 'status-pendiente';
      case EstadoExpediente.EN_PROCESO:
        return 'status-en_proceso';
      case EstadoExpediente.COMPLETADO:
        return 'status-completado';
      case EstadoExpediente.CANCELADO:
        return 'status-cancelado';
      case EstadoExpediente.RECHAZADO:
        return 'status-rechazado';
      default:
        return 'status-pendiente';
    }
  }
}