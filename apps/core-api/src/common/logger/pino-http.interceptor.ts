import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { PinoLoggerService, LogContext } from './logger.service';
import { trace, context } from '@opentelemetry/api';

@Injectable()
export class PinoHttpInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    
    // Only log HTTP requests, not GraphQL
    if (context.getType() === 'http') {
      const ctx = context.switchToHttp();
      const request = ctx.getRequest<Request>();
      const response = ctx.getResponse<Response>();
      const { method, url, ip } = request;
      const userAgent = request.get('User-Agent') || '';

      // Extract expedienteId and cliente from request body or query params
      const expedienteId = this.extractExpedienteId(request);
      const cliente = this.extractCliente(request);

      return next.handle().pipe(
        tap({
          next: (value) => {
            const duration = Date.now() - startTime;
            const logContext: LogContext = {
              context: 'HTTP',
              expedienteId,
              cliente,
              method,
              url,
              statusCode: response.statusCode,
              duration,
              ip,
              userAgent,
            };

            // Add OpenTelemetry trace context
            const activeSpan = trace.getActiveSpan();
            if (activeSpan) {
              const spanContext = activeSpan.spanContext();
              logContext.traceId = spanContext.traceId;
              logContext.spanId = spanContext.spanId;
            }

            this.logger.logWithContext(
              `${method} ${url} ${response.statusCode} ${duration}ms`,
              logContext
            );
          },
          error: (error) => {
            const duration = Date.now() - startTime;
            const logContext: LogContext = {
              context: 'HTTP',
              expedienteId,
              cliente,
              method,
              url,
              statusCode: response.statusCode,
              duration,
              ip,
              userAgent,
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
              `${method} ${url} ${response.statusCode} ${duration}ms - ${error.message}`,
              error.stack,
              logContext
            );
          },
        })
      );
    }

    // For non-HTTP contexts (like GraphQL), just pass through
    return next.handle();
  }

  private extractExpedienteId(request: Request): string | undefined {
    // Try to extract from body first
    if (request.body && typeof request.body === 'object') {
      if (request.body.expedienteId) return request.body.expedienteId;
      if (request.body.id) return request.body.id;
    }
    
    // Try to extract from query params
    if (request.query && typeof request.query === 'object') {
      if (request.query.expedienteId) return String(request.query.expedienteId);
      if (request.query.id) return String(request.query.id);
    }

    return undefined;
  }

  private extractCliente(request: Request): string | undefined {
    // Try to extract from body first
    if (request.body && typeof request.body === 'object') {
      if (request.body.cliente) return request.body.cliente;
      if (request.body.clienteId) return request.body.clienteId;
    }
    
    // Try to extract from query params
    if (request.query && typeof request.query === 'object') {
      if (request.query.cliente) return String(request.query.cliente);
      if (request.query.clienteId) return String(request.query.clienteId);
    }

    return undefined;
  }
}