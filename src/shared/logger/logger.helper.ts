import { Provider } from '@nestjs/common';
import { createLoggerProvider } from './logger.provider';

export function createLoggerProviders(contexts: string[]): Provider[] {
  return contexts.map((context) =>
    createLoggerProvider(`${context}Logger`, context),
  );
}
