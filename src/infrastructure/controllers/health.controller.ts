import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Logger } from '../../shared/logger/logger.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  private readonly startTime = Date.now();

  constructor(
    @Inject('HealthControllerLogger')
    private readonly logger: Logger,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2025-07-16T20:50:00.000Z' },
        uptime: { type: 'number', example: 12345 },
      },
    },
  })
  getHealth() {
    const uptime = Date.now() - this.startTime;

    this.logger.info('GET /health called', {
      uptime,
    });

    const healthResponse = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime,
    };

    this.logger.info('GET /health completed', {
      status: healthResponse.status,
      uptime: healthResponse.uptime,
    });

    return healthResponse;
  }
}
