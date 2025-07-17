import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionsService } from '../../application/use-cases/transactions.service';
import { CreateTransactionDto } from '../../shared/dto/create-transaction.dto';
import { Logger } from '../../shared/logger/logger.service';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    @Inject('TransactionsControllerLogger')
    private readonly logger: Logger,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all transactions (for testing)' })
  async getAllTransactions() {
    this.logger.info('GET /transactions called', {});

    const transactions = await this.transactionsService.getAllTransactions();

    this.logger.info('GET /transactions completed', {
      transactionCount: transactions.length,
    });

    return transactions;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid JSON format',
  })
  @ApiResponse({
    status: 422,
    description: 'Unprocessable Entity - Business rule violation',
  })
  @UsePipes(
    new ValidationPipe({
      transform: false,
      whitelist: true,
      stopAtFirstError: true,
      forbidNonWhitelisted: true,
    }),
  )
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<void> {
    this.logger.info('POST /transactions called', {
      amount: createTransactionDto.amount,
      timestamp: createTransactionDto.timestamp,
    });

    await this.transactionsService.createTransaction(createTransactionDto);

    this.logger.info('POST /transactions completed successfully', {});
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete all transactions' })
  @ApiResponse({
    status: 200,
    description: 'All transactions deleted successfully',
  })
  async deleteAllTransactions(): Promise<void> {
    this.logger.info('DELETE /transactions called', {});

    await this.transactionsService.deleteAllTransactions();

    this.logger.info('DELETE /transactions completed successfully', {});
  }
}
