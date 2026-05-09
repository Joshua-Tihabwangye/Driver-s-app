import { DeliveryService } from '../src/delivery/delivery.service';
import { InMemoryStoreService } from '../src/storage/in-memory-store.service';

describe('DeliveryService', () => {
  it('requires pickup_confirmed before qr verify', () => {
    const store = new InMemoryStoreService();
    const service = new DeliveryService(store);

    expect(() => service.qrVerify('driver-demo-001', 'route-delivery-001', 'abc')).toThrow();
  });

  it('requires all stops completed before dropoff complete', () => {
    const store = new InMemoryStoreService();
    const service = new DeliveryService(store);

    service.pickupConfirm('driver-demo-001', 'route-delivery-001');
    service.qrVerify('driver-demo-001', 'route-delivery-001', 'qr-123');
    service.startRoute('driver-demo-001', 'route-delivery-001');

    expect(() => service.dropoffComplete('driver-demo-001', 'route-delivery-001')).toThrow();
  });
});
