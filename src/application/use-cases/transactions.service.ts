import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { ITransactionRepository } from '../../domain/repositories/transaction-repository.interface';
import { CreateTransactionDto } from '../../shared/dto/create-transaction.dto';
import { StatisticsResponseDto } from '../../shared/dto/statistics-response.dto';
import { Logger } from '../../shared/logger/logger.service';
import { StatisticsGateway } from '../../infrastructure/gateways/statistics.gateway';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    @Inject('TransactionsServiceLogger')
    private readonly logger: Logger,
    @Inject(forwardRef(() => StatisticsGateway))
    private readonly statisticsGateway?: StatisticsGateway,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<void> {
    const { amount, timestamp } = createTransactionDto;
    const transactionDate = new Date(timestamp);
    const now = new Date();

    this.logger.info('Attempting to create transaction', {
      amount,
      timestamp,
    });

    // Validar se a transação não está no futuro
    if (transactionDate > now) {
      this.logger.warn('Transaction rejected - future timestamp', {
        timestamp,
      });
      throw new UnprocessableEntityException(
        'Transaction cannot be in the future',
      );
    }

    // Criar e salvar a transação
    const transaction = Transaction.create(amount, transactionDate);
    await this.transactionRepository.save(transaction);

    this.logger.info('Transaction created successfully', {
      transactionId: transaction.id,
      amount,
    });

    // Notificar WebSocket
    if (this.statisticsGateway) {
      await this.statisticsGateway.broadcastStatisticsUpdate();
    }
  }

  async deleteAllTransactions(): Promise<void> {
    const currentCount = await this.transactionRepository.count();
    await this.transactionRepository.clear();

    this.logger.info('Deleted all transactions', {
      totalRemoved: currentCount,
    });

    // Notificar WebSocket
    if (this.statisticsGateway) {
      await this.statisticsGateway.broadcastStatisticsUpdate();
    }
  }

  async getAllTransactions(): Promise<ReadonlyArray<Transaction>> {
    const transactions = await this.transactionRepository.findAll();
    this.logger.info('Retrieved transactions', {
      count: transactions.length,
    });
    return transactions;
  }

  async getStatistics(): Promise<StatisticsResponseDto> {
    const transactions =
      await this.transactionRepository.findWithinLastSeconds(60);

    this.logger.info('Calculating statistics', {
      transactionsCount: transactions.length,
    });

    if (transactions.length === 0) {
      this.logger.info('No transactions in last 60 seconds', {});
      return {
        count: 0,
        sum: 0,
        avg: 0,
        min: 0,
        max: 0,
      };
    }

    const amounts = transactions.map((t) => t.amount);
    const sum = amounts.reduce((acc, amount) => acc + amount, 0);
    const avg = sum / amounts.length;
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);

    const statistics = {
      count: transactions.length,
      sum: parseFloat(sum.toFixed(2)),
      avg: parseFloat(avg.toFixed(2)),
      min: parseFloat(min.toFixed(2)),
      max: parseFloat(max.toFixed(2)),
    };

    this.logger.info('Statistics calculated', {
      statistics,
    });
    return statistics;
  }
}
