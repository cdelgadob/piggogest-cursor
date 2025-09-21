import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { OTLPTraceExporter } from '@opentelemetry/exporter-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

@Injectable()
export class TracingService implements OnModuleInit, OnModuleDestroy {
  private sdk: NodeSDK;

  onModuleInit() {
    // Only initialize OpenTelemetry if not in test environment
    if (process.env.NODE_ENV !== 'test') {
      try {
        // Create OTLP exporters
        const otlpTraceExporter = new OTLPTraceExporter({
          url: process.env.OTLP_TRACES_ENDPOINT || 'http://localhost:4318/v1/traces',
        });

        const otlpMetricExporter = new OTLPMetricExporter({
          url: process.env.OTLP_METRICS_ENDPOINT || 'http://localhost:4318/v1/metrics',
        });

        // Create metric readers
        const metricReaders = [
          new PrometheusExporter({
            port: parseInt(process.env.METRICS_PORT || '9464'),
            endpoint: '/metrics',
          }),
          new PeriodicExportingMetricReader({
            exporter: otlpMetricExporter,
            exportIntervalMillis: 10000, // Export every 10 seconds
          }),
        ];

        // Initialize OpenTelemetry
        this.sdk = new NodeSDK({
          resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: 'core-api',
            [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
            [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
          }),
          traceExporter: process.env.OTLP_TRACES_ENDPOINT ? otlpTraceExporter : new JaegerExporter({
            endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
          }),
          metricReader: metricReaders,
          instrumentations: [
            getNodeAutoInstrumentations({
              '@opentelemetry/instrumentation-fs': {
                enabled: false,
              },
              '@opentelemetry/instrumentation-http': {
                enabled: true,
              },
              '@opentelemetry/instrumentation-express': {
                enabled: true,
              },
              '@opentelemetry/instrumentation-nestjs-core': {
                enabled: true,
              },
            }),
          ],
        });

        this.sdk.start();
        console.log('OpenTelemetry initialized successfully with OTLP export');
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