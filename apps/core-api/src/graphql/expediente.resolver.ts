import { Resolver, Query, Args, ID, Mutation } from '@nestjs/graphql';
import { Expediente } from '../entities/expediente.entity';
import { EventoExpediente } from '../entities/evento-expediente.entity';
import { Cliente } from '../entities/cliente.entity';
import { TramiteCatalogo } from '../entities/tramite-catalogo.entity';
import { DocumentoReferencia } from '../entities/documento-referencia.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomMetricsService } from '../metrics/custom-metrics.service';
import { PinoLoggerService, LogContext } from '../common/logger/logger.service';

@Resolver(() => Expediente)
export class ExpedienteResolver {
  constructor(
    @InjectRepository(Expediente)
    private expedienteRepository: Repository<Expediente>,
    @InjectRepository(EventoExpediente)
    private eventoRepository: Repository<EventoExpediente>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    @InjectRepository(TramiteCatalogo)
    private tramiteRepository: Repository<TramiteCatalogo>,
    @InjectRepository(DocumentoReferencia)
    private documentoRepository: Repository<DocumentoReferencia>,
    private readonly metricsService: CustomMetricsService,
    private readonly logger: PinoLoggerService,
  ) {}

  @Query(() => [Expediente])
  async expedientes(): Promise<Expediente[]> {
    return this.expedienteRepository.find({
      relations: ['cliente', 'tramiteCatalogo', 'eventos'],
      where: { activo: true },
      order: { createdAt: 'DESC' }
    });
  }

  @Query(() => Expediente, { nullable: true })
  async expediente(@Args('id', { type: () => ID }) id: string): Promise<Expediente | null> {
    return this.expedienteRepository.findOne({
      where: { id },
      relations: ['cliente', 'tramiteCatalogo', 'eventos', 'documentos']
    });
  }

  @Query(() => [EventoExpediente])
  async eventosExpediente(@Args('expedienteId', { type: () => ID }) expedienteId: string): Promise<EventoExpediente[]> {
    return this.eventoRepository.find({
      where: { expedienteId },
      order: { createdAt: 'DESC' }
    });
  }

  @Mutation(() => Expediente)
  async createExpediente(
    @Args('clienteId', { type: () => ID }) clienteId: string,
    @Args('tramiteId', { type: () => ID }) tramiteId: string,
    @Args('descripcion', { type: () => String, nullable: true }) descripcion?: string,
  ): Promise<Expediente> {
    try {
      // Find cliente and tramite
      const cliente = await this.clienteRepository.findOne({ where: { id: clienteId } });
      const tramite = await this.tramiteRepository.findOne({ where: { id: tramiteId } });

      if (!cliente) {
        throw new Error(`Cliente with ID ${clienteId} not found`);
      }

      if (!tramite) {
        throw new Error(`Tramite with ID ${tramiteId} not found`);
      }

      // Create expediente
      const expediente = this.expedienteRepository.create({
        clienteId,
        tramiteId,
        descripcion: descripcion || `Expediente para ${cliente.nombre}`,
        activo: true,
      });

      const savedExpediente = await this.expedienteRepository.save(expediente);

      // Record metrics
      this.metricsService.incrementExpedientesCreated(
        savedExpediente.id,
        cliente.nombre
      );

      // Log with structured context
      const logContext: LogContext = {
        nivel: 'info',
        servicio: 'core-api',
        expedienteId: savedExpediente.id,
        cliente: cliente.nombre,
        context: 'GraphQL',
        operation: 'createExpediente',
        tramiteId,
        descripcion: savedExpediente.descripcion,
      };

      this.logger.logWithContext(
        `Expediente created successfully`,
        logContext
      );

      return savedExpediente;
    } catch (error) {
      // Log error with structured context
      const logContext: LogContext = {
        nivel: 'error',
        servicio: 'core-api',
        clienteId,
        tramiteId,
        context: 'GraphQL',
        operation: 'createExpediente',
        error: error.message,
      };

      this.logger.error(
        `Failed to create expediente: ${error.message}`,
        error.stack,
        logContext
      );

      throw error;
    }
  }

  @Mutation(() => Boolean)
  async simulateOCRError(
    @Args('expedienteId', { type: () => ID }) expedienteId: string,
    @Args('errorType', { type: () => String }) errorType: string,
    @Args('errorMessage', { type: () => String }) errorMessage: string,
  ): Promise<boolean> {
    try {
      // Simulate OCR processing error
      this.metricsService.incrementOCRErrors(expedienteId, errorType, errorMessage);

      // Log with structured context
      const logContext: LogContext = {
        nivel: 'error',
        servicio: 'core-api',
        expedienteId,
        context: 'OCR',
        errorType,
        errorMessage,
      };

      this.logger.logWithContext(
        `OCR error simulated for expediente ${expedienteId}`,
        logContext
      );

      return true;
    } catch (error) {
      this.logger.error(
        `Failed to simulate OCR error: ${error.message}`,
        error.stack,
        'OCR'
      );
      throw error;
    }
  }
}