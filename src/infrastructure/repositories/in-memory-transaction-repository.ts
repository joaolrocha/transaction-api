import { Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { ITransactionRepository } from '../../domain/repositories/transaction-repository.interface';

@Injectable()
export class InMemoryTransactionRepository implements ITransactionRepository {
  private transactions: Transaction[] = [];

  async save(transaction: Transaction): Promise<void> {
    this.transactions.push(transaction);
  }

  async findAll(): Promise<ReadonlyArray<Transaction>> {
    return this.transactions;
  }

  async findByTimeRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ReadonlyArray<Transaction>> {
    return this.transactions.filter(
      (transaction) =>
        transaction.timestamp >= startDate && transaction.timestamp <= endDate,
    );
  }

  async clear(): Promise<void> {
    this.transactions = [];
  }

  async count(): Promise<number> {
    return this.transactions.length;
  }

  // Método auxiliar para estatísticas dos últimos N segundos
  async findWithinLastSeconds(
    seconds: number,
  ): Promise<ReadonlyArray<Transaction>> {
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - seconds * 1000);

    return this.transactions.filter(
      (transaction) => transaction.timestamp >= cutoffTime,
    );
  }
}
