import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './infrastructure/config/winston.config';
@Module({
  imports: [
    TransactionsModule,
    WinstonModule.forRoot(winstonConfig),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000, // 1 minuto
        limit: 10, // 10 requests por minuto
      },
      {
        name: 'long',
        ttl: 300000, // 5 minutos
        limit: 100, // 100 requests por 5 minutos
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
