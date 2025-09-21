import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { Logger } from 'pino';

export interface LogContext {
  nivel?: string;
  servicio?: string;
  expedienteId?: string;
  cliente?: string;
  traceId?: string;
  spanId?: string;
  [key: string]: any;
}

@Injectable()
export class PinoLoggerService implements NestLoggerService {
  private readonly logger: Logger;

  constructor() {
    this.logger = require('pino')({
      level: process.env.LOG_LEVEL || 'info',
      formatters: {
        level: (label) => {
          return { nivel: label };
        },
      },
      timestamp: () => `,"time":"${new Date().toISOString()}"`,
      base: {
        servicio: 'core-api',
        version: '1.0.0',
      },
    });
  }

  log(message: any, context?: string | LogContext) {
    const logContext = typeof context === 'string' ? { context } : context || {};
    this.logger.info(logContext, message);
  }

  error(message: any, trace?: string, context?: string | LogContext) {
    const logContext = typeof context === 'string' ? { context, trace } : { ...context, trace };
    this.logger.error(logContext, message);
  }

  warn(message: any, context?: string | LogContext) {
    const logContext = typeof context === 'string' ? { context } : context || {};
    this.logger.warn(logContext, message);
  }

  debug(message: any, context?: string | LogContext) {
    const logContext = typeof context === 'string' ? { context } : context || {};
    this.logger.debug(logContext, message);
  }

  verbose(message: any, context?: string | LogContext) {
    const logContext = typeof context === 'string' ? { context } : context || {};
    this.logger.trace(logContext, message);
  }

  // Método adicional para logging estructurado con contexto específico
  logWithContext(message: any, context: LogContext) {
    this.logger.info(context, message);
  }
}