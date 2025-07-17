import { Inject, forwardRef } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TransactionsService } from '../../application/use-cases/transactions.service';
import { Logger } from '../../shared/logger/logger.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  namespace: '/statistics',
})
export class StatisticsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedClients = new Set<string>();

  constructor(
    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionsService: TransactionsService,
    @Inject('StatisticsGatewayLogger')
    private readonly logger: Logger,
  ) {}

  handleConnection(client: Socket) {
    this.connectedClients.add(client.id);

    this.logger.info('Client connected to statistics gateway', {
      clientId: client.id,
      clientsCount: this.connectedClients.size,
    });
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);

    this.logger.info('Client disconnected from statistics gateway', {
      clientId: client.id,
      clientsCount: this.connectedClients.size,
    });
  }

  @SubscribeMessage('get-current-statistics')
  async handleGetCurrentStatistics(client: Socket) {
    const statistics = await this.transactionsService.getStatistics();

    this.logger.info('Sending current statistics to client', {
      clientId: client.id,
      statistics,
    });

    client.emit('statistics-update', statistics);
  }

  async broadcastStatisticsUpdate() {
    const statistics = await this.transactionsService.getStatistics();

    this.logger.info('Broadcasting statistics update', {
      statistics,
      clientsCount: this.connectedClients.size,
    });

    this.server.emit('statistics-update', statistics);
  }
}
