import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';

@Injectable()
export class Logger {
  private readonly context: string;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly winston: WinstonLogger,
    contextClass: { name: string },
  ) {
    this.context = contextClass.name;
  }

  info(message: string, meta?: any): void {
    this.winston.info(message, {
      context: this.context,
      ...meta,
    });
  }

  warn(message: string, meta?: any): void {
    this.winston.warn(message, {
      context: this.context,
      ...meta,
    });
  }

  error(message: string, meta?: any): void {
    this.winston.error(message, {
      context: this.context,
      ...meta,
    });
  }

  debug(message: string, meta?: any): void {
    this.winston.debug(message, {
      context: this.context,
      ...meta,
    });
  }
}
