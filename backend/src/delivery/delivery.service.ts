import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryStoreService } from '../storage/in-memory-store.service';

@Injectable()
export class DeliveryService {
  constructor(private readonly store: InMemoryStoreService) {}

  listOrders(driverId: string) {
    return this.store.deliveryOrders.filter((item) => item.driverId === driverId);
  }

  acceptOrder(driverId: string, orderId: string) {
    const order = this.store.deliveryOrders.find((item) => item.id === orderId && item.driverId === driverId);
    if (!order) {
      throw new NotFoundException('Delivery order not found');
    }

    order.status = 'accepted';
    return order;
  }

  getRoute(driverId: string, routeId: string) {
    const route = this.store.deliveryRoutes.find((item) => item.id === routeId && item.driverId === driverId);
    if (!route) {
      throw new NotFoundException('Delivery route not found');
    }
    return route;
  }

  pickupConfirm(driverId: string, routeId: string) {
    const route = this.getRoute(driverId, routeId);
    route.status = 'pickup_confirmed';
    this.updateOrderFromRoute(routeId, 'accepted');
    return route;
  }

  qrVerify(driverId: string, routeId: string, qrValue: string) {
    if (!qrValue.trim()) {
      throw new BadRequestException('QR value is required');
    }

    const route = this.getRoute(driverId, routeId);
    if (route.status !== 'pickup_confirmed') {
      throw new BadRequestException('Route must be pickup_confirmed before QR verification');
    }

    route.status = 'qr_verified';
    return route;
  }

  startRoute(driverId: string, routeId: string) {
    const route = this.getRoute(driverId, routeId);
    if (!['pickup_confirmed', 'qr_verified'].includes(route.status)) {
      throw new BadRequestException('Route is not ready to start');
    }
    route.status = 'in_progress';
    this.updateOrderFromRoute(routeId, 'in_route');
    return route;
  }

  completeStop(driverId: string, routeId: string, stopId: string) {
    const route = this.getRoute(driverId, routeId);
    const stop = route.stops.find((item) => item.id === stopId);
    if (!stop) {
      throw new NotFoundException('Delivery stop not found');
    }

    stop.status = 'completed';
    return {
      routeId,
      stop,
      remainingStops: route.stops.filter((item) => item.status !== 'completed').length,
    };
  }

  dropoffComplete(driverId: string, routeId: string) {
    const route = this.getRoute(driverId, routeId);
    const incomplete = route.stops.filter((item) => item.status !== 'completed');
    if (incomplete.length > 0) {
      throw new BadRequestException('All stops must be completed before dropoff confirmation');
    }

    route.status = 'completed';
    this.updateOrderFromRoute(routeId, 'completed');
    return route;
  }

  private updateOrderFromRoute(routeId: string, status: 'accepted' | 'in_route' | 'completed') {
    const order = this.store.deliveryOrders.find((item) => item.routeId === routeId);
    if (order) {
      order.status = status;
    }
  }
}
