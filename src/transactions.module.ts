import { Module } from '@nestjs/common';
import { TransactionsService } from './application/use-cases/transactions.service';
import { HealthController } from './infrastructure/controllers/health.controller';
import { StatisticsController } from './infrastructure/controllers/statistics.controller';
import { TransactionsController } from './infrastructure/controllers/transactions.controller';
import { InMemoryTransactionRepository } from './infrastructure/repositories/in-memory-transaction-repository';
// import { createLoggerProvider } from './shared/logger/logger.provider';
import { createLoggerProviders } from './shared/logger/logger.helper';

@Module({
  controllers: [TransactionsController, StatisticsController, HealthController],
  providers: [
    TransactionsService,
    {
      provide: 'ITransactionRepository',
      useClass: InMemoryTransactionRepository,
    },
    ...createLoggerProviders([
      'TransactionsService',
      'TransactionsController',
      'HealthController',
      'StatisticsController',
    ]),
  ],
})
export class TransactionsModule {}
