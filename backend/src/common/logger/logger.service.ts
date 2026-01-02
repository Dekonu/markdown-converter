import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  private context?: string;

  setContext(context: string) {
    this.context = context;
  }

  log(message: string, context?: string) {
    console.log(`[${context || this.context || 'App'}] ${message}`);
  }

  error(message: string, trace?: string, context?: string) {
    console.error(`[${context || this.context || 'App'}] ERROR: ${message}`, trace ? `\n${trace}` : '');
  }

  warn(message: string, context?: string) {
    console.warn(`[${context || this.context || 'App'}] WARN: ${message}`);
  }

  debug(message: string, context?: string) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${context || this.context || 'App'}] DEBUG: ${message}`);
    }
  }

  verbose(message: string, context?: string) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${context || this.context || 'App'}] VERBOSE: ${message}`);
    }
  }
}

