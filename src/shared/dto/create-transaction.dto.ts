import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, Min } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Transaction amount (positive or zero)',
    example: 123.45,
    minimum: 0,
  })
  @Min(0, { message: 'Amount cannot be negative' })
  @IsNumber({}, { message: 'Amount must be a valid number' })
  amount: number;

  @ApiProperty({
    description: 'Transaction timestamp in ISO 8601 format (UTC)',
    example: '2024-07-16T10:00:00.000Z',
  })
  @IsDateString({}, { message: 'Timestamp must be a valid ISO 8601 date' })
  timestamp: string;
}
