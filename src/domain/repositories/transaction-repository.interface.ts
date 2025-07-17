import { Transaction } from '../entities/transaction.entity';

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<void>;
  findAll(): Promise<ReadonlyArray<Transaction>>;
  findByTimeRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ReadonlyArray<Transaction>>;
  clear(): Promise<void>;
  count(): Promise<number>;
  findWithinLastSeconds(seconds: number): Promise<ReadonlyArray<Transaction>>;
}
