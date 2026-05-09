import { TripsService } from '../src/trips/trips.service';
import { InMemoryStoreService } from '../src/storage/in-memory-store.service';

describe('TripsService', () => {
  it('enforces state transitions', () => {
    const store = new InMemoryStoreService();
    const service = new TripsService(store);

    const trip = service.startFromJob('driver-demo-001', 'job-ride-001', 'ride');

    expect(() => service.complete('driver-demo-001', trip.id)).toThrow();
  });

  it('completes standard trip flow', () => {
    const store = new InMemoryStoreService();
    const service = new TripsService(store);

    const trip = service.startFromJob('driver-demo-001', 'job-ride-001', 'ride');
    service.markEnRoute('driver-demo-001', trip.id);
    service.arrive('driver-demo-001', trip.id);
    service.verifyRider('driver-demo-001', trip.id, trip.otpCode || '');
    service.start('driver-demo-001', trip.id);
    const completed = service.complete('driver-demo-001', trip.id);

    expect(completed.status).toBe('completed');
  });
});
