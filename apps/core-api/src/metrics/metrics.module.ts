import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { CustomMetricsService } from './custom-metrics.service';

@Module({
  controllers: [MetricsController],
  providers: [CustomMetricsService],
  exports: [CustomMetricsService],
})
export class MetricsModule {}