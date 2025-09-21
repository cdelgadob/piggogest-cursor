import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CustomMetricsService } from '../metrics/custom-metrics.service';
import { PinoLoggerService, LogContext } from '../common/logger/logger.service';
import { trace } from '@opentelemetry/api';

@Injectable()
export class GraphQLMetricsInterceptor implements NestInterceptor {
  constructor(
    private readonly metricsService: CustomMetricsService,
    private readonly logger: PinoLoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    
    // Only process GraphQL requests
    if (context.getType() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      const info = gqlContext.getInfo();
      const operationName = info.operation.name?.value || 'Anonymous';
      const fieldName = info.fieldName;

      // Extract expedienteId and cliente from GraphQL context
      const expedienteId = this.extractExpedienteIdFromContext(gqlContext);
      const cliente = this.extractClienteFromContext(gqlContext);

      return next.handle().pipe(
        tap({
          next: (value) => {
            const duration = Date.now() - startTime;
            const success = true;

            // Record GraphQL latency metric
            this.metricsService.recordGraphQLLatency(operationName, duration, success);

            // Log GraphQL request with structured context
            const logContext: LogContext = {
              nivel: 'info',
              servicio: 'core-api',
              expedienteId,
              cliente,
              context: 'GraphQL',
              operation: operationName,
              field: fieldName,
              duration,
              success,
            };

            // Add OpenTelemetry trace context
            const activeSpan = trace.getActiveSpan();
            if (activeSpan) {
              const spanContext = activeSpan.spanContext();
              logContext.traceId = spanContext.traceId;
              logContext.spanId = spanContext.spanId;
            }

            this.logger.logWithContext(
              `GraphQL ${operationName}.${fieldName} completed in ${duration}ms`,
              logContext
            );
          },
          error: (error) => {
            const duration = Date.now() - startTime;
            const success = false;

            // Record GraphQL latency metric (even for errors)
            this.metricsService.recordGraphQLLatency(operationName, duration, success);

            // Log GraphQL error with structured context
            const logContext: LogContext = {
              nivel: 'error',
              servicio: 'core-api',
              expedienteId,
              cliente,
              context: 'GraphQL',
              operation: operationName,
              field: fieldName,
              duration,
              success,
              error: error.message,
            };

            // Add OpenTelemetry trace context
            const activeSpan = trace.getActiveSpan();
            if (activeSpan) {
              const spanContext = activeSpan.spanContext();
              logContext.traceId = spanContext.traceId;
              logContext.spanId = spanContext.spanId;
            }

            this.logger.error(
              `GraphQL ${operationName}.${fieldName} failed in ${duration}ms: ${error.message}`,
              error.stack,
              logContext
            );
          },
        }),
        catchError((error) => {
          const duration = Date.now() - startTime;
          const success = false;

          // Record GraphQL latency metric for caught errors
          this.metricsService.recordGraphQLLatency(operationName, duration, success);

          // Log GraphQL error with structured context
          const logContext: LogContext = {
            nivel: 'error',
            servicio: 'core-api',
            expedienteId,
            cliente,
            context: 'GraphQL',
            operation: operationName,
            field: fieldName,
            duration,
            success,
            error: error.message,
          };

          // Add OpenTelemetry trace context
          const activeSpan = trace.getActiveSpan();
          if (activeSpan) {
            const spanContext = activeSpan.spanContext();
            logContext.traceId = spanContext.traceId;
            logContext.spanId = spanContext.spanId;
          }

          this.logger.error(
            `GraphQL ${operationName}.${fieldName} failed in ${duration}ms: ${error.message}`,
            error.stack,
            logContext
          );

          throw error;
        })
      );
    }

    // For non-GraphQL contexts, just pass through
    return next.handle();
  }

  private extractExpedienteIdFromContext(gqlContext: GqlExecutionContext): string | undefined {
    try {
      const args = gqlContext.getArgs();
      if (args && typeof args === 'object') {
        if (args.expedienteId) return String(args.expedienteId);
        if (args.id) return String(args.id);
      }

      const context = gqlContext.getContext();
      if (context && typeof context === 'object') {
        if (context.expedienteId) return String(context.expedienteId);
        if (context.id) return String(context.id);
      }
    } catch (error) {
      // Ignore extraction errors
    }

    return undefined;
  }

  private extractClienteFromContext(gqlContext: GqlExecutionContext): string | undefined {
    try {
      const args = gqlContext.getArgs();
      if (args && typeof args === 'object') {
        if (args.cliente) return String(args.cliente);
        if (args.clienteId) return String(args.clienteId);
      }

      const context = gqlContext.getContext();
      if (context && typeof context === 'object') {
        if (context.cliente) return String(context.cliente);
        if (context.clienteId) return String(context.clienteId);
      }
    } catch (error) {
      // Ignore extraction errors
    }

    return undefined;
  }
}