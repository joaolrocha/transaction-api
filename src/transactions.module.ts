import { Module } from '@nestjs/common';
import { TransactionsService } from './application/use-cases/transactions.service';
import { HealthController } from './infrastructure/controllers/health.controller';
import { StatisticsController } from './infrastructure/controllers/statistics.controller';
import { TransactionsController } from './infrastructure/controllers/transactions.controller';
import { InMemoryTransactionRepository } from './infrastructure/repositories/in-memory-transaction-repository';
// import { createLoggerProvider } from './shared/logger/logger.provider';
import { createLoggerProviders } from './shared/logger/logger.helper';
import { StatisticsGateway } from './infrastructure/gateways/statistics.gateway';

@Module({
  controllers: [TransactionsController, StatisticsController, HealthController],
  providers: [
    TransactionsService,
    StatisticsGateway,
    {
      provide: 'ITransactionRepository',
      useClass: InMemoryTransactionRepository,
    },
    ...createLoggerProviders([
      'TransactionsService',
      'TransactionsController',
      'HealthController',
      'StatisticsController',
      'StatisticsGateway',
    ]),
  ],
  exports: [TransactionsService, StatisticsGateway],
})
export class TransactionsModule {}
