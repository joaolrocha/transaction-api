import { Module } from '@nestjs/common';
import { TransactionsController } from './infrastructure/controllers/transactions.controller';
import { TransactionsService } from './application/use-cases/transactions.service';
import { InMemoryTransactionRepository } from './infrastructure/repositories/in-memory-transaction-repository';
import { StatisticsController } from './infrastructure/controllers/statistics.controller';
import { HealthController } from './infrastructure/controllers/health.controller';

@Module({
  controllers: [TransactionsController, StatisticsController, HealthController],
  providers: [
    TransactionsService,
    {
      provide: 'ITransactionRepository',
      useClass: InMemoryTransactionRepository,
    },
  ],
})
export class TransactionsModule {}
