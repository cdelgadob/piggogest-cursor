import { DataSource } from 'typeorm';
import { TramiteCatalogo, TipoTramite, EstadoTramite } from '../entities';

export class TransferenciaV1Seed {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    const tramiteRepository = this.dataSource.getRepository(TramiteCatalogo);

    // Check if tramite already exists
    const existingTramite = await tramiteRepository.findOne({
      where: { nombre: 'Transferencia de Propiedad v1.0' }
    });

    if (existingTramite) {
      console.log('Transferencia v1.0 tramite already exists, skipping seed...');
      return;
    }

    const transferenciaTramite = tramiteRepository.create({
      nombre: 'Transferencia de Propiedad v1.0',
      descripcion: 'Proceso completo para la transferencia de propiedad de un inmueble, incluyendo verificación de documentos, validación legal y registro oficial.',
      tipo: TipoTramite.TRANSFERENCIA,
      version: '1.0.0',
      estado: EstadoTramite.ACTIVO,
      duracionEstimada: 30, // 30 days
      costo: 2500.00,
      activo: true,
      pasos: [
        {
          id: 'step_1',
          nombre: 'Recepción de Documentos',
          descripcion: 'Recopilación y verificación inicial de todos los documentos requeridos',
          orden: 1,
          duracionEstimada: 2, // days
          esObligatorio: true,
          responsable: 'Recepción',
          estado: 'pendiente'
        },
        {
          id: 'step_2',
          nombre: 'Verificación Legal',
          descripcion: 'Revisión legal de documentos y validación de títulos de propiedad',
          orden: 2,
          duracionEstimada: 5,
          esObligatorio: true,
          responsable: 'Departamento Legal',
          estado: 'pendiente'
        },
        {
          id: 'step_3',
          nombre: 'Inspección del Inmueble',
          descripcion: 'Inspección física del inmueble y verificación de condiciones',
          orden: 3,
          duracionEstimada: 3,
          esObligatorio: true,
          responsable: 'Inspector',
          estado: 'pendiente'
        },
        {
          id: 'step_4',
          nombre: 'Avalúo Comercial',
          descripcion: 'Realización de avalúo comercial del inmueble por perito certificado',
          orden: 4,
          duracionEstimada: 7,
          esObligatorio: true,
          responsable: 'Perito Avalúador',
          estado: 'pendiente'
        },
        {
          id: 'step_5',
          nombre: 'Procesamiento de Impuestos',
          descripcion: 'Cálculo y procesamiento de impuestos de transferencia',
          orden: 5,
          duracionEstimada: 3,
          esObligatorio: true,
          responsable: 'Contador',
          estado: 'pendiente'
        },
        {
          id: 'step_6',
          nombre: 'Registro Oficial',
          descripcion: 'Presentación y registro oficial de la transferencia en el registro de la propiedad',
          orden: 6,
          duracionEstimada: 10,
          esObligatorio: true,
          responsable: 'Registrador',
          estado: 'pendiente'
        }
      ],
      sla: {
        general: {
          tiempoMaximo: 30, // days
          tiempoObjetivo: 20, // days
          nivelServicio: 95 // percentage
        },
        porPaso: {
          'step_1': { tiempoMaximo: 2, tiempoObjetivo: 1, nivelServicio: 98 },
          'step_2': { tiempoMaximo: 5, tiempoObjetivo: 3, nivelServicio: 95 },
          'step_3': { tiempoMaximo: 3, tiempoObjetivo: 2, nivelServicio: 97 },
          'step_4': { tiempoMaximo: 7, tiempoObjetivo: 5, nivelServicio: 90 },
          'step_5': { tiempoMaximo: 3, tiempoObjetivo: 2, nivelServicio: 95 },
          'step_6': { tiempoMaximo: 10, tiempoObjetivo: 7, nivelServicio: 85 }
        },
        escalacion: {
          nivel1: { tiempo: 24, accion: 'Notificación al responsable' },
          nivel2: { tiempo: 48, accion: 'Escalación al supervisor' },
          nivel3: { tiempo: 72, accion: 'Escalación a gerencia' }
        },
        notificaciones: {
          cliente: {
            inicio: true,
            progreso: [25, 50, 75],
            completado: true,
            retraso: true
          },
          responsable: {
            asignacion: true,
            vencimiento: true,
            retraso: true
          }
        }
      },
      requisitos: [
        {
          id: 'req_1',
          nombre: 'Cédula de Identidad',
          descripcion: 'Cédula de identidad vigente del comprador y vendedor',
          tipo: 'documento',
          esObligatorio: true,
          formato: 'PDF',
          tamanoMaximo: '5MB'
        },
        {
          id: 'req_2',
          nombre: 'Título de Propiedad',
          descripcion: 'Título de propiedad original del inmueble',
          tipo: 'documento',
          esObligatorio: true,
          formato: 'PDF',
          tamanoMaximo: '10MB'
        },
        {
          id: 'req_3',
          nombre: 'Certificado de Libertad',
          descripcion: 'Certificado de libertad y tradición del inmueble',
          tipo: 'documento',
          esObligatorio: true,
          formato: 'PDF',
          tamanoMaximo: '5MB'
        },
        {
          id: 'req_4',
          nombre: 'Certificado de Paz y Salvo',
          descripcion: 'Certificado de paz y salvo de predial y servicios públicos',
          tipo: 'documento',
          esObligatorio: true,
          formato: 'PDF',
          tamanoMaximo: '5MB'
        },
        {
          id: 'req_5',
          nombre: 'Contrato de Compraventa',
          descripcion: 'Contrato de compraventa firmado por ambas partes',
          tipo: 'documento',
          esObligatorio: true,
          formato: 'PDF',
          tamanoMaximo: '10MB'
        },
        {
          id: 'req_6',
          nombre: 'Avalúo Comercial',
          descripcion: 'Avalúo comercial vigente del inmueble',
          tipo: 'documento',
          esObligatorio: true,
          formato: 'PDF',
          tamanoMaximo: '5MB'
        }
      ],
      configuracion: {
        flujo: {
          tipo: 'secuencial',
          permiteParalelo: false,
          requiereAprobacion: true
        },
        validaciones: {
          documentos: {
            verificarFormato: true,
            verificarTamano: true,
            verificarIntegridad: true
          },
          fechas: {
            verificarVigencia: true,
            diasVigencia: 30
          }
        },
        integraciones: {
          registroPropiedad: {
            habilitado: true,
            endpoint: 'https://api.registro-propiedad.gov.co',
            timeout: 30000
          },
          avaluos: {
            habilitado: true,
            proveedor: 'avalúos-certificados',
            timeout: 60000
          }
        },
        notificaciones: {
          email: {
            habilitado: true,
            plantillas: {
              inicio: 'tramite-inicio',
              progreso: 'tramite-progreso',
              completado: 'tramite-completado'
            }
          },
          sms: {
            habilitado: true,
            eventos: ['inicio', 'completado']
          }
        }
      }
    });

    await tramiteRepository.save(transferenciaTramite);
    console.log('Transferencia v1.0 tramite seed completed successfully!');
  }
}