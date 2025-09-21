import { DataSource } from 'typeorm';
import { Expediente, EstadoExpediente } from '../entities/expediente.entity';
import { EventoExpediente, TipoEvento, NivelEvento } from '../entities/evento-expediente.entity';
import { Cliente } from '../entities/cliente.entity';
import { TramiteCatalogo } from '../entities/tramite-catalogo.entity';

export class ExpedientesSeed {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    console.log('🌱 Seeding expedientes...');

    // Create tramites catalog
    const tramiteRepository = this.dataSource.getRepository(TramiteCatalogo);
    
    const tramites = [
      {
        nombre: 'Consulta Legal',
        descripcion: 'Consulta general sobre temas legales',
        categoria: 'Consultoría',
        tiempoEstimado: 7,
        requisitos: ['Documento de identidad', 'Descripción del caso']
      },
      {
        nombre: 'Proceso de Divorcio',
        descripcion: 'Tramitación de proceso de divorcio',
        categoria: 'Familia',
        tiempoEstimado: 30,
        requisitos: ['Acta de matrimonio', 'Documentos de identidad', 'Acuerdo de bienes']
      },
      {
        nombre: 'Contrato de Compraventa',
        descripcion: 'Elaboración de contrato de compraventa inmobiliaria',
        categoria: 'Inmobiliaria',
        tiempoEstimado: 14,
        requisitos: ['Escritura de propiedad', 'Documentos de identidad', 'Avalúo']
      }
    ];

    const savedTramites = await tramiteRepository.save(tramites);

    // Create clients
    const clienteRepository = this.dataSource.getRepository(Cliente);
    
    const clientes = [
      {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@email.com',
        telefono: '+1234567890',
        documento: '12345678',
        tipoDocumento: 'DNI',
        direccion: 'Calle Principal 123',
        ciudad: 'Madrid',
        pais: 'España',
        codigoPostal: '28001'
      },
      {
        nombre: 'María',
        apellido: 'García',
        email: 'maria.garcia@email.com',
        telefono: '+1234567891',
        documento: '87654321',
        tipoDocumento: 'DNI',
        direccion: 'Avenida Central 456',
        ciudad: 'Barcelona',
        pais: 'España',
        codigoPostal: '08001'
      },
      {
        nombre: 'Carlos',
        apellido: 'López',
        email: 'carlos.lopez@email.com',
        telefono: '+1234567892',
        documento: '11223344',
        tipoDocumento: 'DNI',
        direccion: 'Plaza Mayor 789',
        ciudad: 'Valencia',
        pais: 'España',
        codigoPostal: '46001'
      }
    ];

    const savedClientes = await clienteRepository.save(clientes);

    // Create expedientes
    const expedienteRepository = this.dataSource.getRepository(Expediente);
    
    const expedientes = [
      {
        numeroExpediente: 'EXP-2024-001',
        estado: EstadoExpediente.PENDIENTE,
        descripcion: 'Consulta legal sobre propiedad inmobiliaria',
        fechaInicio: new Date('2024-01-15'),
        fechaVencimiento: new Date('2024-02-15'),
        progreso: 25,
        responsable: 'Abogado Principal',
        observaciones: 'Cliente requiere asesoramiento urgente',
        activo: true,
        clienteId: savedClientes[0].id,
        tramiteCatalogoId: savedTramites[0].id
      },
      {
        numeroExpediente: 'EXP-2024-002',
        estado: EstadoExpediente.EN_PROCESO,
        descripcion: 'Proceso de divorcio de mutuo acuerdo',
        fechaInicio: new Date('2024-01-10'),
        fechaVencimiento: new Date('2024-02-10'),
        progreso: 60,
        responsable: 'Especialista en Derecho Familiar',
        observaciones: 'Documentación en revisión',
        activo: true,
        clienteId: savedClientes[1].id,
        tramiteCatalogoId: savedTramites[1].id
      },
      {
        numeroExpediente: 'EXP-2024-003',
        estado: EstadoExpediente.COMPLETADO,
        descripcion: 'Contrato de compraventa de vivienda',
        fechaInicio: new Date('2023-12-01'),
        fechaCompletado: new Date('2024-01-05'),
        progreso: 100,
        responsable: 'Especialista en Derecho Inmobiliario',
        observaciones: 'Proceso completado exitosamente',
        activo: true,
        clienteId: savedClientes[2].id,
        tramiteCatalogoId: savedTramites[2].id
      }
    ];

    const savedExpedientes = await expedienteRepository.save(expedientes);

    // Create eventos for each expediente
    const eventoRepository = this.dataSource.getRepository(EventoExpediente);
    
    const eventos = [
      // Eventos para EXP-2024-001
      {
        tipo: TipoEvento.CREACION,
        nivel: NivelEvento.INFO,
        titulo: 'Expediente Creado',
        descripcion: 'Se ha creado el expediente EXP-2024-001 para consulta legal',
        usuario: 'Sistema',
        sistema: 'Admin Panel',
        esAutomatico: true,
        requiereAtencion: false,
        expedienteId: savedExpedientes[0].id
      },
      {
        tipo: TipoEvento.NOTIFICACION,
        nivel: NivelEvento.INFO,
        titulo: 'Asignación de Responsable',
        descripcion: 'El expediente ha sido asignado al Abogado Principal',
        usuario: 'Admin',
        sistema: 'Admin Panel',
        esAutomatico: false,
        requiereAtencion: false,
        expedienteId: savedExpedientes[0].id
      },
      {
        tipo: TipoEvento.CAMBIO_ESTADO,
        nivel: NivelEvento.SUCCESS,
        titulo: 'Estado Actualizado',
        descripcion: 'El expediente ha cambiado a estado PENDIENTE',
        usuario: 'Sistema',
        sistema: 'Admin Panel',
        esAutomatico: true,
        requiereAtencion: false,
        expedienteId: savedExpedientes[0].id
      },

      // Eventos para EXP-2024-002
      {
        tipo: TipoEvento.CREACION,
        nivel: NivelEvento.INFO,
        titulo: 'Expediente Creado',
        descripcion: 'Se ha creado el expediente EXP-2024-002 para proceso de divorcio',
        usuario: 'Sistema',
        sistema: 'Admin Panel',
        esAutomatico: true,
        requiereAtencion: false,
        expedienteId: savedExpedientes[1].id
      },
      {
        tipo: TipoEvento.DOCUMENTO_SUBIDO,
        nivel: NivelEvento.SUCCESS,
        titulo: 'Documento Subido',
        descripcion: 'Se ha subido el acta de matrimonio',
        usuario: 'María García',
        sistema: 'Portal Cliente',
        esAutomatico: false,
        requiereAtencion: false,
        expedienteId: savedExpedientes[1].id
      },
      {
        tipo: TipoEvento.CAMBIO_ESTADO,
        nivel: NivelEvento.INFO,
        titulo: 'Estado Actualizado',
        descripcion: 'El expediente ha cambiado a estado EN_PROCESO',
        usuario: 'Sistema',
        sistema: 'Admin Panel',
        esAutomatico: true,
        requiereAtencion: false,
        expedienteId: savedExpedientes[1].id
      },
      {
        tipo: TipoEvento.ACTUALIZACION,
        nivel: NivelEvento.INFO,
        titulo: 'Progreso Actualizado',
        descripcion: 'El progreso del expediente se ha actualizado al 60%',
        usuario: 'Especialista en Derecho Familiar',
        sistema: 'Admin Panel',
        esAutomatico: false,
        requiereAtencion: false,
        expedienteId: savedExpedientes[1].id
      },

      // Eventos para EXP-2024-003
      {
        tipo: TipoEvento.CREACION,
        nivel: NivelEvento.INFO,
        titulo: 'Expediente Creado',
        descripcion: 'Se ha creado el expediente EXP-2024-003 para contrato de compraventa',
        usuario: 'Sistema',
        sistema: 'Admin Panel',
        esAutomatico: true,
        requiereAtencion: false,
        expedienteId: savedExpedientes[2].id
      },
      {
        tipo: TipoEvento.DOCUMENTO_SUBIDO,
        nivel: NivelEvento.SUCCESS,
        titulo: 'Documento Subido',
        descripcion: 'Se ha subido la escritura de propiedad',
        usuario: 'Carlos López',
        sistema: 'Portal Cliente',
        esAutomatico: false,
        requiereAtencion: false,
        expedienteId: savedExpedientes[2].id
      },
      {
        tipo: TipoEvento.DOCUMENTO_VERIFICADO,
        nivel: NivelEvento.SUCCESS,
        titulo: 'Documento Verificado',
        descripcion: 'La escritura de propiedad ha sido verificada y validada',
        usuario: 'Especialista en Derecho Inmobiliario',
        sistema: 'Admin Panel',
        esAutomatico: false,
        requiereAtencion: false,
        expedienteId: savedExpedientes[2].id
      },
      {
        tipo: TipoEvento.COMPLETADO,
        nivel: NivelEvento.SUCCESS,
        titulo: 'Expediente Completado',
        descripcion: 'El contrato de compraventa ha sido finalizado exitosamente',
        usuario: 'Especialista en Derecho Inmobiliario',
        sistema: 'Admin Panel',
        esAutomatico: false,
        requiereAtencion: false,
        expedienteId: savedExpedientes[2].id
      }
    ];

    await eventoRepository.save(eventos);

    console.log('✅ Expedientes seeded successfully');
  }
}