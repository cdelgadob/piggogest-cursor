import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';
import { GraphQLModule } from './graphql/graphql.module';
import { LoggerModule } from './common/logger/logger.module';
import { TracingModule } from './common/tracing/tracing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule,
    TracingModule,
    HealthModule,
    MetricsModule,
    GraphQLModule,
  ],
})
export class AppModule {}