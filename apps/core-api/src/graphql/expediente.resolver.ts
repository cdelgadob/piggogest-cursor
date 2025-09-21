import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { Expediente } from '../entities/expediente.entity';
import { EventoExpediente } from '../entities/evento-expediente.entity';
import { Cliente } from '../entities/cliente.entity';
import { TramiteCatalogo } from '../entities/tramite-catalogo.entity';
import { DocumentoReferencia } from '../entities/documento-referencia.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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
}