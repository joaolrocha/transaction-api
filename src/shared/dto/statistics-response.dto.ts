import { ApiProperty } from '@nestjs/swagger';

export class StatisticsResponseDto {
  @ApiProperty({
    description: 'Total number of transactions in the last 60 seconds',
    example: 10,
  })
  count: number;

  @ApiProperty({
    description: 'Sum of all transaction amounts in the last 60 seconds',
    example: 1234.56,
  })
  sum: number;

  @ApiProperty({
    description: 'Average of transaction amounts in the last 60 seconds',
    example: 123.45,
  })
  avg: number;

  @ApiProperty({
    description: 'Minimum transaction amount in the last 60 seconds',
    example: 12.34,
  })
  min: number;

  @ApiProperty({
    description: 'Maximum transaction amount in the last 60 seconds',
    example: 456.78,
  })
  max: number;
}
