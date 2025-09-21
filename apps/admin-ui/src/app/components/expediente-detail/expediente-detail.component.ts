import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ExpedientesService } from '../../services/expedientes.service';
import { Expediente, EventoExpediente, TipoEvento, NivelEvento } from '../../models/expediente.model';

@Component({
  selector: 'app-expediente-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="expediente-detail-container">
      <div class="header-actions">
        <button class="back-button" (click)="goBack()">
          ← Volver a Expedientes
        </button>
      </div>

      <div *ngIf="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Cargando expediente...</p>
      </div>

      <div *ngIf="!isLoading && expediente" class="expediente-content">
        <!-- Header Card -->
        <div class="card header-card">
          <div class="header-info">
            <h1>{{ expediente.numeroExpediente }}</h1>
            <div class="status-section">
              <span class="status-badge" [ngClass]="getStatusClass(expediente.estado)">
                {{ expediente.estado }}
              </span>
              <div class="progress-section">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="expediente.progreso || 0"></div>
                  <span class="progress-text">{{ expediente.progreso || 0 }}%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="header-actions">
            <div class="info-grid">
              <div class="info-item">
                <label>Cliente:</label>
                <span>{{ expediente.cliente.nombre }} {{ expediente.cliente.apellido }}</span>
              </div>
              <div class="info-item">
                <label>Email:</label>
                <span>{{ expediente.cliente.email }}</span>
              </div>
              <div class="info-item">
                <label>Trámite:</label>
                <span>{{ expediente.tramiteCatalogo.nombre }}</span>
              </div>
              <div class="info-item">
                <label>Responsable:</label>
                <span>{{ expediente.responsable || 'Sin asignar' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
          <!-- Details Card -->
          <div class="card details-card">
            <h2>Detalles del Expediente</h2>
            <div class="details-grid">
              <div class="detail-item">
                <label>Descripción:</label>
                <p>{{ expediente.descripcion || 'Sin descripción' }}</p>
              </div>
              <div class="detail-item">
                <label>Fecha de Inicio:</label>
                <span>{{ formatDate(expediente.fechaInicio) }}</span>
              </div>
              <div class="detail-item">
                <label>Fecha de Vencimiento:</label>
                <span>{{ formatDate(expediente.fechaVencimiento) }}</span>
              </div>
              <div class="detail-item">
                <label>Fecha de Completado:</label>
                <span>{{ formatDate(expediente.fechaCompletado) }}</span>
              </div>
              <div class="detail-item">
                <label>Observaciones:</label>
                <p>{{ expediente.observaciones || 'Sin observaciones' }}</p>
              </div>
            </div>
          </div>

          <!-- Timeline Card -->
          <div class="card timeline-card">
            <h2>Timeline de Eventos</h2>
            <div class="timeline">
              <div *ngFor="let evento of expediente.eventos; let i = index" 
                   class="timeline-item" 
                   [ngClass]="getEventClass(evento.nivel)">
                <div class="timeline-marker">
                  <div class="marker-icon" [ngClass]="getEventIconClass(evento.tipo)">
                    {{ getEventIcon(evento.tipo) }}
                  </div>
                </div>
                <div class="timeline-content">
                  <div class="event-header">
                    <h3>{{ evento.titulo }}</h3>
                    <span class="event-time">{{ formatDateTime(evento.createdAt) }}</span>
                  </div>
                  <p class="event-description">{{ evento.descripcion }}</p>
                  <div class="event-meta">
                    <span *ngIf="evento.usuario" class="event-user">
                      👤 {{ evento.usuario }}
                    </span>
                    <span *ngIf="evento.sistema" class="event-system">
                      🔧 {{ evento.sistema }}
                    </span>
                    <span *ngIf="evento.esAutomatico" class="event-auto">
                      🤖 Automático
                    </span>
                    <span *ngIf="evento.requiereAtencion" class="event-attention">
                      ⚠️ Requiere Atención
                    </span>
                  </div>
                  <div *ngIf="evento.accionRequerida" class="event-action">
                    <strong>Acción Requerida:</strong> {{ evento.accionRequerida }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!isLoading && !expediente" class="error-container">
        <h2>Expediente no encontrado</h2>
        <p>El expediente solicitado no existe o no tienes permisos para verlo.</p>
        <button class="back-button" (click)="goBack()">
          ← Volver a Expedientes
        </button>
      </div>
    </div>
  `,
  styles: [`
    .expediente-detail-container {
      padding: 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-actions {
      margin-bottom: 1rem;
    }

    .back-button {
      background: #667eea;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s;
    }

    .back-button:hover {
      background: #5a6fd8;
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

    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 1rem;
      overflow: hidden;
    }

    .header-card {
      padding: 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .header-info h1 {
      margin: 0 0 1rem 0;
      font-size: 2rem;
    }

    .status-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 14px;
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

    .progress-section {
      flex: 1;
      max-width: 300px;
    }

    .progress-bar {
      position: relative;
      width: 100%;
      height: 24px;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
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
      color: white;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .info-item label {
      font-size: 12px;
      opacity: 0.8;
      text-transform: uppercase;
      font-weight: 500;
    }

    .main-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .details-card, .timeline-card {
      padding: 1.5rem;
    }

    .details-card h2, .timeline-card h2 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1.25rem;
    }

    .details-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .detail-item label {
      font-weight: 500;
      color: #666;
      font-size: 14px;
    }

    .detail-item p {
      margin: 0;
      color: #333;
    }

    .timeline {
      position: relative;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 20px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #e0e0e0;
    }

    .timeline-item {
      position: relative;
      margin-bottom: 2rem;
      padding-left: 3rem;
    }

    .timeline-marker {
      position: absolute;
      left: 0;
      top: 0;
      width: 40px;
      height: 40px;
      background: white;
      border: 3px solid #e0e0e0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .timeline-item.info .timeline-marker {
      border-color: #2196f3;
    }

    .timeline-item.success .timeline-marker {
      border-color: #4caf50;
    }

    .timeline-item.warning .timeline-marker {
      border-color: #ff9800;
    }

    .timeline-item.error .timeline-marker {
      border-color: #f44336;
    }

    .marker-icon {
      font-size: 16px;
    }

    .timeline-content {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      border-left: 4px solid #e0e0e0;
    }

    .timeline-item.info .timeline-content {
      border-left-color: #2196f3;
    }

    .timeline-item.success .timeline-content {
      border-left-color: #4caf50;
    }

    .timeline-item.warning .timeline-content {
      border-left-color: #ff9800;
    }

    .timeline-item.error .timeline-content {
      border-left-color: #f44336;
    }

    .event-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .event-header h3 {
      margin: 0;
      font-size: 16px;
      color: #333;
    }

    .event-time {
      font-size: 12px;
      color: #666;
    }

    .event-description {
      margin: 0 0 0.5rem 0;
      color: #555;
      line-height: 1.4;
    }

    .event-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .event-meta span {
      font-size: 12px;
      padding: 2px 6px;
      border-radius: 4px;
      background: #e9ecef;
      color: #495057;
    }

    .event-action {
      font-size: 14px;
      color: #dc3545;
      background: #f8d7da;
      padding: 0.5rem;
      border-radius: 4px;
      border-left: 3px solid #dc3545;
    }

    .error-container {
      text-align: center;
      padding: 2rem;
    }

    .error-container h2 {
      color: #dc3545;
      margin-bottom: 1rem;
    }

    @media (max-width: 768px) {
      .main-content {
        grid-template-columns: 1fr;
      }
      
      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ExpedienteDetailComponent implements OnInit {
  expediente: Expediente | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private expedientesService: ExpedientesService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadExpediente(id);
    }
  }

  loadExpediente(id: string) {
    this.isLoading = true;
    this.expedientesService.getExpedienteById(id).subscribe({
      next: (expediente) => {
        this.expediente = expediente;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading expediente:', error);
        this.isLoading = false;
      }
    });
  }

  goBack() {
    window.history.back();
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'No especificada';
    return new Date(date).toLocaleDateString('es-ES');
  }

  formatDateTime(date: Date): string {
    return new Date(date).toLocaleString('es-ES');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pendiente':
        return 'status-pendiente';
      case 'en_proceso':
        return 'status-en_proceso';
      case 'completado':
        return 'status-completado';
      case 'cancelado':
        return 'status-cancelado';
      case 'rechazado':
        return 'status-rechazado';
      default:
        return 'status-pendiente';
    }
  }

  getEventClass(nivel: NivelEvento): string {
    return nivel.toLowerCase();
  }

  getEventIconClass(tipo: TipoEvento): string {
    return `icon-${tipo.toLowerCase()}`;
  }

  getEventIcon(tipo: TipoEvento): string {
    switch (tipo) {
      case TipoEvento.CREACION:
        return '📝';
      case TipoEvento.ACTUALIZACION:
        return '✏️';
      case TipoEvento.CAMBIO_ESTADO:
        return '🔄';
      case TipoEvento.DOCUMENTO_SUBIDO:
        return '📄';
      case TipoEvento.DOCUMENTO_VERIFICADO:
        return '✅';
      case TipoEvento.NOTIFICACION:
        return '🔔';
      case TipoEvento.ESCALACION:
        return '⬆️';
      case TipoEvento.COMPLETADO:
        return '🎉';
      case TipoEvento.CANCELADO:
        return '❌';
      default:
        return '📋';
    }
  }
}