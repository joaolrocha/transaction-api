import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { ITransactionRepository } from '../../domain/repositories/transaction-repository.interface';
import { CreateTransactionDto } from '../../shared/dto/create-transaction.dto';
import { StatisticsResponseDto } from '../../shared/dto/statistics-response.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async getAllTransactions(): Promise<Transaction[]> {
    return await this.transactionRepository.findAll();
  }

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<void> {
    const { amount, timestamp } = createTransactionDto;
    const transactionDate = new Date(timestamp);
    const now = new Date();
    // Validar se a transação não está no futuro
    if (transactionDate > now) {
      throw new UnprocessableEntityException(
        'Transaction cannot be in the future',
      );
    }

    // Criar e salvar a transação
    const transaction = Transaction.create(amount, transactionDate);
    await this.transactionRepository.save(transaction);
  }

  async deleteAllTransactions(): Promise<void> {
    await this.transactionRepository.clear();
  }

  async getStatistics(): Promise<StatisticsResponseDto> {
    // TESTE: pegar TODAS as transações temporariamente
    const repository = this.transactionRepository as any;
    const transactions = await repository.findWithinLastSeconds(60);

    if (transactions.length === 0) {
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

    return {
      count: transactions.length,
      sum: parseFloat(sum.toFixed(2)),
      avg: parseFloat(avg.toFixed(2)),
      min: parseFloat(min.toFixed(2)),
      max: parseFloat(max.toFixed(2)),
    };
  }
}
