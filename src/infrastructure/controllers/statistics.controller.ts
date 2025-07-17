import { Controller, Get, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionsService } from '../../application/use-cases/transactions.service';
import { StatisticsResponseDto } from '../../shared/dto/statistics-response.dto';
import { Logger } from '../../shared/logger/logger.service';

@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    @Inject('StatisticsControllerLogger')
    private readonly logger: Logger,
  ) {}

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
    this.logger.info('GET /statistics called', {});

    const statistics = await this.transactionsService.getStatistics();

    this.logger.info('GET /statistics completed', {
      statisticsCount: statistics.count,
      statisticsSum: statistics.sum,
    });

    return statistics;
  }
}
