import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './infrastructure/config/winston.config';
import { TransactionsModule } from './transactions.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TransactionsModule,
    WinstonModule.forRoot(winstonConfig),
    ThrottlerModule.forRootAsync({
      useFactory: () => [
        {
          name: 'short',
          ttl: parseInt(process.env.RATE_LIMIT_SHORT_TTL),
          limit: parseInt(process.env.RATE_LIMIT_SHORT_LIMIT),
        },
        {
          name: 'long',
          ttl: parseInt(process.env.RATE_LIMIT_LONG_TTL),
          limit: parseInt(process.env.RATE_LIMIT_LONG_LIMIT),
        },
      ],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
