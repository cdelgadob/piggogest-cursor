import { Injectable, OnModuleInit } from '@nestjs/common';
import { metrics, Meter, Counter, Histogram } from '@opentelemetry/api';
import { PinoLoggerService } from '../common/logger/logger.service';

@Injectable()
export class CustomMetricsService implements OnModuleInit {
  private meter: Meter;
  private graphqlLatencyHistogram: Histogram;
  private expedientesCreatedCounter: Counter;
  private ocrErrorsCounter: Counter;

  constructor(private readonly logger: PinoLoggerService) {}

  onModuleInit() {
    try {
      // Get the meter from the global metrics API
      this.meter = metrics.getMeter('core-api-metrics', '1.0.0');

      // Create GraphQL latency histogram
      this.graphqlLatencyHistogram = this.meter.createHistogram('graphql_request_duration_ms', {
        description: 'Duration of GraphQL requests in milliseconds',
        unit: 'ms',
      });

      // Create expedientes created counter
      this.expedientesCreatedCounter = this.meter.createCounter('expedientes_created_total', {
        description: 'Total number of expedientes created',
      });

      // Create OCR errors counter
      this.ocrErrorsCounter = this.meter.createCounter('ocr_errors_total', {
        description: 'Total number of OCR processing errors',
      });

      this.logger.log('Custom metrics service initialized successfully', 'CustomMetricsService');
    } catch (error) {
      this.logger.error('Failed to initialize custom metrics service', error.stack, 'CustomMetricsService');
    }
  }

  /**
   * Record GraphQL request latency
   */
  recordGraphQLLatency(operationName: string, duration: number, success: boolean = true) {
    try {
      this.graphqlLatencyHistogram.record(duration, {
        operation: operationName,
        success: success.toString(),
      });
    } catch (error) {
      this.logger.warn('Failed to record GraphQL latency metric', { error: error.message });
    }
  }

  /**
   * Increment expedientes created counter
   */
  incrementExpedientesCreated(expedienteId?: string, cliente?: string) {
    try {
      this.expedientesCreatedCounter.add(1, {
        expedienteId: expedienteId || 'unknown',
        cliente: cliente || 'unknown',
      });

      this.logger.logWithContext('Expediente created metric recorded', {
        nivel: 'info',
        servicio: 'core-api',
        expedienteId,
        cliente,
        metric: 'expedientes_created_total',
      });
    } catch (error) {
      this.logger.warn('Failed to record expedientes created metric', { error: error.message });
    }
  }

  /**
   * Increment OCR errors counter
   */
  incrementOCRErrors(expedienteId?: string, errorType?: string, errorMessage?: string) {
    try {
      this.ocrErrorsCounter.add(1, {
        expedienteId: expedienteId || 'unknown',
        errorType: errorType || 'unknown',
      });

      this.logger.logWithContext('OCR error metric recorded', {
        nivel: 'error',
        servicio: 'core-api',
        expedienteId,
        metric: 'ocr_errors_total',
        errorType,
        errorMessage,
      });
    } catch (error) {
      this.logger.warn('Failed to record OCR error metric', { error: error.message });
    }
  }

  /**
   * Get current meter instance (for advanced usage)
   */
  getMeter(): Meter {
    return this.meter;
  }
}