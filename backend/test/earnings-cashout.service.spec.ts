import { EarningsCashoutService } from '../src/earnings-cashout/earnings-cashout.service';
import { InMemoryStoreService } from '../src/storage/in-memory-store.service';

describe('EarningsCashoutService', () => {
  it('rejects cashout over available balance', () => {
    const store = new InMemoryStoreService();
    const service = new EarningsCashoutService(store);

    expect(() =>
      service.createCashoutRequest('driver-demo-001', {
        methodId: 'mobile-money',
        amount: 999999,
      }),
    ).toThrow();
  });
});
