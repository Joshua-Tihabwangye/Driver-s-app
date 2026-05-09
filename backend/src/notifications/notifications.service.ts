import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryStoreService } from '../storage/in-memory-store.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly store: InMemoryStoreService) {}

  list(driverId: string) {
    return this.store.notifications
      .filter((item) => item.driverId === driverId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  markRead(driverId: string, notificationId: string) {
    const notification = this.store.notifications.find(
      (item) => item.id === notificationId && item.driverId === driverId,
    );
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    notification.read = true;
    return notification;
  }

  markAllRead(driverId: string) {
    let updated = 0;
    for (const notification of this.store.notifications) {
      if (notification.driverId === driverId && !notification.read) {
        notification.read = true;
        updated += 1;
      }
    }
    return { updated };
  }
}
