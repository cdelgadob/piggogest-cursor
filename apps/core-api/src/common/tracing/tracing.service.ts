import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

@Injectable()
export class TracingService implements OnModuleInit, OnModuleDestroy {
  private sdk: NodeSDK;

  onModuleInit() {
    // Only initialize OpenTelemetry if not in test environment
    if (process.env.NODE_ENV !== 'test') {
      try {
        // Initialize OpenTelemetry
        this.sdk = new NodeSDK({
          resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: 'core-api',
            [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
          }),
          traceExporter: new JaegerExporter({
            endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
          }),
          metricReader: new PrometheusExporter({
            port: parseInt(process.env.METRICS_PORT || '9464'),
            endpoint: '/metrics',
          }),
          instrumentations: [
            getNodeAutoInstrumentations({
              '@opentelemetry/instrumentation-fs': {
                enabled: false,
              },
            }),
          ],
        });

        this.sdk.start();
        console.log('OpenTelemetry initialized successfully');
      } catch (error) {
        console.warn('Failed to initialize OpenTelemetry:', error.message);
      }
    }
  }

  onModuleDestroy() {
    if (this.sdk) {
      this.sdk.shutdown();
    }
  }
}