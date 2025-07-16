import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';

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

  await app.listen(3000);
  console.log('🚀 Application running on: http://localhost:3000');
  console.log('📚 Swagger documentation: http://localhost:3000/api');
  console.log('🔒 Rate limiting: 10 req/min, 100 req/5min');
}
bootstrap();
