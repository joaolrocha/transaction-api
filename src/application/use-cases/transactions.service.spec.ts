import { UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { ITransactionRepository } from '../../domain/repositories/transaction-repository.interface';
import { Transaction } from '../../domain/entities/transaction.entity';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let mockRepository: jest.Mocked<ITransactionRepository>;
  let mockLogger: any;

  beforeEach(async () => {
    // Mock do repository
    mockRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findByTimeRange: jest.fn(),
      clear: jest.fn(),
      count: jest.fn(),
      findWithinLastSeconds: jest.fn(),
    };

    // Mock do logger
    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: 'ITransactionRepository',
          useValue: mockRepository,
        },
        {
          provide: 'TransactionsServiceLogger',
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  describe('createTransaction', () => {
    it('should create a transaction successfully', async () => {
      const createTransactionDto = {
        amount: 100,
        timestamp: '2025-07-16T20:00:00.000Z',
      };

      await service.createTransaction(createTransactionDto);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 100,
          timestamp: new Date('2025-07-16T20:00:00.000Z'),
        }),
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Transaction created successfully',
        expect.any(Object),
      );
    });

    it('should throw error for future timestamp', async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);

      const createTransactionDto = {
        amount: 100,
        timestamp: futureDate.toISOString(),
      };

      await expect(
        service.createTransaction(createTransactionDto),
      ).rejects.toThrow(UnprocessableEntityException);

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Transaction rejected - future timestamp',
        expect.any(Object),
      );
    });
  });

  describe('getStatistics', () => {
    it('should return zero statistics when no transactions', async () => {
      mockRepository.findWithinLastSeconds.mockResolvedValue([]);

      const result = await service.getStatistics();

      expect(result).toEqual({
        count: 0,
        sum: 0,
        avg: 0,
        min: 0,
        max: 0,
      });
    });

    it('should calculate statistics correctly', async () => {
      const mockTransactions = [
        new Transaction(100, new Date(), 'id1'),
        new Transaction(50, new Date(), 'id2'),
        new Transaction(25, new Date(), 'id3'),
      ];

      mockRepository.findWithinLastSeconds.mockResolvedValue(mockTransactions);

      const result = await service.getStatistics();

      expect(result).toEqual({
        count: 3,
        sum: 175,
        avg: 58.33,
        min: 25,
        max: 100,
      });
    });
  });

  describe('deleteAllTransactions', () => {
    it('should delete all transactions', async () => {
      mockRepository.count.mockResolvedValue(5);

      await service.deleteAllTransactions();

      expect(mockRepository.clear).toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Deleted all transactions',
        expect.objectContaining({ totalRemoved: 5 }),
      );
    });
  });
});
