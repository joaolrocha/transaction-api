import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionsService } from '../../application/use-cases/transactions.service';
import { StatisticsResponseDto } from '../../shared/dto/statistics-response.dto';

@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get transaction statistics for the last 60 seconds',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    type: StatisticsResponseDto,
  })
  async getStatistics(): Promise<StatisticsResponseDto> {
    return await this.transactionsService.getStatistics();
  }
}
