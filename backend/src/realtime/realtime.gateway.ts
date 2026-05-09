import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Injectable, Logger } from '@nestjs/common';
import type { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';

interface DriverSocketData {
  driverId: string;
  userId: string;
}

@Injectable()
@WebSocketGateway({
  namespace: '/driver-realtime',
  cors: { origin: '*' },
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(RealtimeGateway.name);

  constructor(private readonly authService: AuthService) {}

  handleConnection(client: Socket) {
    const token = this.readToken(client);
    if (!token) {
      client.disconnect(true);
      return;
    }

    const payload = this.authService.verifyAccessToken(token);
    if (!payload) {
      client.disconnect(true);
      return;
    }

    const data: DriverSocketData = {
      driverId: payload.driverId,
      userId: payload.sub,
    };

    client.data.auth = data;
    client.join(`driver:${payload.driverId}`);
    this.logger.log(`Socket connected for driver ${payload.driverId}`);
  }

  handleDisconnect(client: Socket) {
    const auth = client.data.auth as DriverSocketData | undefined;
    if (auth) {
      this.logger.log(`Socket disconnected for driver ${auth.driverId}`);
    }
  }

  @SubscribeMessage('subscribe')
  subscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { channel: 'trip' | 'delivery-route'; id: string },
  ) {
    if (!body?.id || !body?.channel) {
      client.emit('error', { code: 'INVALID_SUBSCRIPTION', message: 'channel and id are required' });
      return;
    }

    const room = `${body.channel}:${body.id}`;
    client.join(room);
    client.emit('subscribed', { room });
  }

  @SubscribeMessage('location.update')
  locationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { tripId?: string; latitude: number; longitude: number; timestamp?: number },
  ) {
    const auth = client.data.auth as DriverSocketData | undefined;
    if (!auth) {
      client.emit('error', { code: 'UNAUTHORIZED', message: 'Unauthorized socket' });
      return;
    }

    const payload = {
      driverId: auth.driverId,
      ...body,
      timestamp: body.timestamp ?? Date.now(),
    };

    this.server.to(`driver:${auth.driverId}`).emit('trip.location.updated', payload);
    if (body.tripId) {
      this.server.to(`trip:${body.tripId}`).emit('trip.location.updated', payload);
    }
  }

  @SubscribeMessage('job.offer.response')
  jobOfferResponse(@ConnectedSocket() client: Socket, @MessageBody() body: { jobId: string; action: 'accept' | 'reject' }) {
    const auth = client.data.auth as DriverSocketData | undefined;
    if (!auth) {
      client.emit('error', { code: 'UNAUTHORIZED', message: 'Unauthorized socket' });
      return;
    }

    this.server.to(`driver:${auth.driverId}`).emit('job.offer.updated', {
      jobId: body.jobId,
      action: body.action,
      driverId: auth.driverId,
      timestamp: Date.now(),
    });
  }

  @SubscribeMessage('trip.ack')
  tripAck(@ConnectedSocket() client: Socket, @MessageBody() body: { tripId: string; event: string }) {
    const auth = client.data.auth as DriverSocketData | undefined;
    if (!auth) {
      client.emit('error', { code: 'UNAUTHORIZED', message: 'Unauthorized socket' });
      return;
    }

    client.emit('trip.ack.received', {
      tripId: body.tripId,
      event: body.event,
      receivedAt: Date.now(),
    });
  }

  publishEvent(input: {
    driverId?: string;
    tripId?: string;
    routeId?: string;
    event: string;
    payload: Record<string, unknown>;
  }) {
    if (input.driverId) {
      this.server.to(`driver:${input.driverId}`).emit(input.event, input.payload);
    }
    if (input.tripId) {
      this.server.to(`trip:${input.tripId}`).emit(input.event, input.payload);
    }
    if (input.routeId) {
      this.server.to(`delivery-route:${input.routeId}`).emit(input.event, input.payload);
    }
  }

  private readToken(client: Socket): string | null {
    const authToken = client.handshake.auth?.token;
    if (typeof authToken === 'string' && authToken.trim()) {
      return authToken;
    }

    const header = client.handshake.headers.authorization;
    if (typeof header === 'string' && header.startsWith('Bearer ')) {
      return header.slice('Bearer '.length);
    }

    return null;
  }
}
