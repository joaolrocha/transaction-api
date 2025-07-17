import { Provider } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from './logger.service';

export function createLoggerProvider(
  token: string,
  contextName: string,
): Provider {
  return {
    provide: token,
    useFactory: (winston: any) => new Logger(winston, { name: contextName }),
    inject: [WINSTON_MODULE_PROVIDER],
  };
}
