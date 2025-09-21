import { Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppResolver } from './app.resolver';
import { ExpedienteResolver } from './expediente.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expediente } from '../entities/expediente.entity';
import { EventoExpediente } from '../entities/evento-expediente.entity';
import { Cliente } from '../entities/cliente.entity';
import { TramiteCatalogo } from '../entities/tramite-catalogo.entity';
import { DocumentoReferencia } from '../entities/documento-referencia.entity';

@Module({
  imports: [
    NestGraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
      introspection: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature([
      Expediente,
      EventoExpediente,
      Cliente,
      TramiteCatalogo,
      DocumentoReferencia
    ])
  ],
  providers: [AppResolver, ExpedienteResolver],
})
export class GraphQLModule {}