import { Transaction } from '../entities/transaction.entity';

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<void>;
  findAll(): Promise<Transaction[]>;
  findByTimeRange(startDate: Date, endDate: Date): Promise<Transaction[]>;
  clear(): Promise<void>;
  count(): Promise<number>;
  findWithinLastSeconds(seconds: number): Promise<Transaction[]>;
}
