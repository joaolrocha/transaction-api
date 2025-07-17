import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet()); // Proteção contra vulnerabilidades comuns

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Transaction API')
    .setDescription(
      'API for managing financial transactions with real-time statistics',
    )
    .setVersion('1.0')
    .addTag('transactions', 'Transaction management endpoints')
    .addTag('statistics', 'Statistics calculation endpoints')
    .addTag('health', 'Health check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT;
  await app.listen(port);

  console.log(`Application running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api`);
  console.log(
    `Rate limiting: ${process.env.RATE_LIMIT_SHORT_LIMIT} req/min, ${process.env.RATE_LIMIT_LONG_LIMIT} req/5min`,
  );
}
bootstrap();
