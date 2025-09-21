export { Cliente } from './cliente.entity';
export { TramiteCatalogo, EstadoTramite, TipoTramite } from './tramite-catalogo.entity';
export { Expediente, EstadoExpediente } from './expediente.entity';
export { DocumentoReferencia, TipoDocumento, EstadoDocumento } from './documento-referencia.entity';
export { EventoExpediente, TipoEvento, NivelEvento } from './evento-expediente.entity';

// Export all entities as an array for TypeORM
import { Cliente } from './cliente.entity';
import { TramiteCatalogo } from './tramite-catalogo.entity';
import { Expediente } from './expediente.entity';
import { DocumentoReferencia } from './documento-referencia.entity';
import { EventoExpediente } from './evento-expediente.entity';

export const entities = [
  Cliente,
  TramiteCatalogo,
  Expediente,
  DocumentoReferencia,
  EventoExpediente,
];