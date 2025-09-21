import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, GridApi, ColumnApi, IFilterParams, IDoesFilterPassParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { ExpedientesService } from '../../services/expedientes.service';
import { Expediente, EstadoExpediente } from '../../models/expediente.model';

@Component({
  selector: 'app-expedientes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AgGridModule],
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
            <div class="grid-toolbar">
              <div class="toolbar-left">
                <button 
                  class="btn btn-primary force-transition-btn"
                  [disabled]="!selectedExpediente"
                  (click)="openForceTransitionDialog()">
                  🔄 Forzar Transición
                </button>
                <span *ngIf="selectedExpediente" class="selected-info">
                  Seleccionado: {{ selectedExpediente.numeroExpediente }}
                </span>
              </div>
              <div class="toolbar-right">
                <button class="btn btn-secondary" (click)="clearFilters()">
                  🧹 Limpiar Filtros
                </button>
              </div>
            </div>
            
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
              (selectionChanged)="onSelectionChanged($event)"
              class="ag-theme-alpine">
            </ag-grid-angular>
          </div>
        </div>
        
        <!-- Force Transition Confirmation Dialog -->
        <div *ngIf="showForceTransitionDialog" class="modal-overlay" (click)="closeForceTransitionDialog()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>🔄 Forzar Transición de Estado</h3>
              <button class="close-btn" (click)="closeForceTransitionDialog()">&times;</button>
            </div>
            <div class="modal-body">
              <div class="expediente-info">
                <p><strong>Expediente:</strong> {{ selectedExpediente?.numeroExpediente }}</p>
                <p><strong>Cliente:</strong> {{ selectedExpediente?.cliente?.nombre }} {{ selectedExpediente?.cliente?.apellido }}</p>
                <p><strong>Estado Actual:</strong> 
                  <span class="status-badge" [ngClass]="getStatusClass(selectedExpediente?.estado)">
                    {{ selectedExpediente?.estado }}
                  </span>
                </p>
              </div>
              
              <div class="form-group">
                <label for="newStatus">Nuevo Estado:</label>
                <select id="newStatus" [(ngModel)]="newStatus" class="form-control">
                  <option value="">Seleccionar estado...</option>
                  <option *ngFor="let status of availableStatuses" [value]="status.value">
                    {{ status.label }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="transitionReason">Motivo de la transición:</label>
                <textarea 
                  id="transitionReason" 
                  [(ngModel)]="transitionReason" 
                  class="form-control" 
                  rows="3"
                  placeholder="Describe el motivo de forzar esta transición...">
                </textarea>
              </div>
              
              <div class="warning-box">
                <strong>⚠️ Advertencia:</strong> Esta acción forzará un cambio de estado y será registrada en el log de auditoría.
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closeForceTransitionDialog()">
                Cancelar
              </button>
              <button 
                class="btn btn-danger" 
                [disabled]="!newStatus || !transitionReason.trim()"
                (click)="confirmForceTransition()">
                Confirmar Transición
              </button>
            </div>
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
    
    .grid-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding: 0.75rem;
      background-color: #f8f9fa;
      border-radius: 6px;
      border: 1px solid #dee2e6;
    }
    
    .toolbar-left, .toolbar-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .btn-primary {
      background-color: #667eea;
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background-color: #5a6fd8;
    }
    
    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }
    
    .btn-secondary:hover:not(:disabled) {
      background-color: #5a6268;
    }
    
    .btn-danger {
      background-color: #dc3545;
      color: white;
    }
    
    .btn-danger:hover:not(:disabled) {
      background-color: #c82333;
    }
    
    .force-transition-btn {
      background-color: #ff6b35;
    }
    
    .force-transition-btn:hover:not(:disabled) {
      background-color: #e55a2b;
    }
    
    .selected-info {
      font-size: 14px;
      color: #495057;
      font-weight: 500;
    }
    
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .modal-content {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #dee2e6;
    }
    
    .modal-header h3 {
      margin: 0;
      color: #333;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #6c757d;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .close-btn:hover {
      color: #333;
    }
    
    .modal-body {
      padding: 1.5rem;
    }
    
    .expediente-info {
      background-color: #f8f9fa;
      padding: 1rem;
      border-radius: 6px;
      margin-bottom: 1.5rem;
    }
    
    .expediente-info p {
      margin: 0.5rem 0;
      color: #495057;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }
    
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }
    
    .warning-box {
      background-color: #fff3cd;
      border: 1px solid #ffeaa7;
      color: #856404;
      padding: 1rem;
      border-radius: 6px;
      margin-bottom: 1.5rem;
    }
    
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding: 1.5rem;
      border-top: 1px solid #dee2e6;
    }
  `]
})
export class ExpedientesComponent implements OnInit {
  expedientes: Expediente[] = [];
  isLoading = true;
  selectedExpediente: Expediente | null = null;
  showForceTransitionDialog = false;
  newStatus = '';
  transitionReason = '';
  
  availableStatuses = [
    { value: EstadoExpediente.PENDIENTE, label: 'Pendiente' },
    { value: EstadoExpediente.EN_PROCESO, label: 'En Proceso' },
    { value: EstadoExpediente.COMPLETADO, label: 'Completado' },
    { value: EstadoExpediente.CANCELADO, label: 'Cancelado' },
    { value: EstadoExpediente.RECHAZADO, label: 'Rechazado' }
  ];
  
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
      filter: 'agSetColumnFilter',
      filterParams: {
        values: Object.values(EstadoExpediente),
        valueFormatter: (params: any) => {
          const statusLabels: { [key: string]: string } = {
            'pendiente': 'Pendiente',
            'en_proceso': 'En Proceso',
            'completado': 'Completado',
            'cancelado': 'Cancelado',
            'rechazado': 'Rechazado'
          };
          return statusLabels[params.value] || params.value;
        }
      },
      cellRenderer: (params: any) => {
        const statusClass = this.getStatusClass(params.value);
        return `<span class="status-badge ${statusClass}">${params.value}</span>`;
      }
    },
    {
      headerName: 'Cliente',
      field: 'cliente.nombre',
      width: 200,
      filter: 'agTextColumnFilter',
      filterParams: {
        filterOptions: ['contains', 'equals', 'startsWith'],
        debounceMs: 200
      },
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

  onSelectionChanged(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();
    this.selectedExpediente = selectedRows.length > 0 ? selectedRows[0] : null;
  }

  openForceTransitionDialog() {
    if (this.selectedExpediente) {
      this.showForceTransitionDialog = true;
      this.newStatus = '';
      this.transitionReason = '';
    }
  }

  closeForceTransitionDialog() {
    this.showForceTransitionDialog = false;
    this.newStatus = '';
    this.transitionReason = '';
  }

  confirmForceTransition() {
    if (this.selectedExpediente && this.newStatus && this.transitionReason.trim()) {
      this.isLoading = true;
      
      this.expedientesService.forceTransition(
        this.selectedExpediente.id,
        this.newStatus,
        this.transitionReason,
        'Usuario Admin' // TODO: Get from auth service
      ).subscribe({
        next: (updatedExpediente) => {
          // Update the expediente in the local array
          const index = this.expedientes.findIndex(e => e.id === updatedExpediente.id);
          if (index !== -1) {
            this.expedientes[index] = updatedExpediente;
            this.gridApi.refreshCells();
          }
          
          this.closeForceTransitionDialog();
          this.isLoading = false;
          
          // Show success message
          alert('Transición forzada exitosamente. Esta acción ha sido registrada en el log de auditoría.');
        },
        error: (error) => {
          console.error('Error forcing transition:', error);
          this.isLoading = false;
          alert('Error al forzar la transición: ' + error.message);
        }
      });
    }
  }

  clearFilters() {
    this.gridApi.setFilterModel(null);
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