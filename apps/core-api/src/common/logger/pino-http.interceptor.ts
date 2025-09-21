import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { PinoLoggerService } from './logger.service';

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

      return next.handle().pipe(
        tap({
          next: (value) => {
            const duration = Date.now() - startTime;
            this.logger.log(
              `${method} ${url} ${response.statusCode} ${duration}ms - ${userAgent}`,
              'HTTP'
            );
          },
          error: (error) => {
            const duration = Date.now() - startTime;
            this.logger.error(
              `${method} ${url} ${response.statusCode} ${duration}ms - ${userAgent} - ${error.message}`,
              error.stack,
              'HTTP'
            );
          },
        })
      );
    }

    // For non-HTTP contexts (like GraphQL), just pass through
    return next.handle();
  }
}