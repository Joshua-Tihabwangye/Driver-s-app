import { BadRequestException, Injectable } from '@nestjs/common';
import { InMemoryStoreService } from '../storage/in-memory-store.service';

@Injectable()
export class EarningsCashoutService {
  constructor(private readonly store: InMemoryStoreService) {}

  getSummary(driverId: string, period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'week') {
    const now = Date.now();
    const periodMs: Record<'day' | 'week' | 'month' | 'quarter' | 'year', number> = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      quarter: 90 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000,
    };

    const threshold = now - periodMs[period];
    const events = this.store.earnings.filter(
      (event) => event.driverId === driverId && event.createdAt >= threshold,
    );

    const total = events.reduce((sum, event) => sum + event.amount, 0);
    return {
      period,
      total,
      currency: 'UGX',
      count: events.length,
    };
  }

  getEvents(driverId: string) {
    return this.store.earnings.filter((event) => event.driverId === driverId);
  }

  getWallet(driverId: string) {
    const wallet = this.store.wallets.find((item) => item.driverId === driverId);
    if (!wallet) {
      return {
        driverId,
        currency: 'UGX',
        availableBalance: 0,
      };
    }
    return wallet;
  }

  getCashoutMethods(_driverId: string) {
    return [
      { id: 'mobile-money', label: 'Mobile Money', minAmount: 5000 },
      { id: 'bank-transfer', label: 'Bank Transfer', minAmount: 20000 },
    ];
  }

  createCashoutRequest(driverId: string, input: { methodId: string; amount: number }) {
    const wallet = this.store.wallets.find((item) => item.driverId === driverId);
    if (!wallet) {
      throw new BadRequestException('Wallet not found');
    }

    if (input.amount > wallet.availableBalance) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    wallet.availableBalance -= input.amount;
    const request = {
      id: this.store.id(),
      driverId,
      methodId: input.methodId,
      amount: input.amount,
      status: 'pending' as const,
      createdAt: Date.now(),
    };
    this.store.cashoutRequests.push(request);
    return request;
  }

  listCashoutRequests(driverId: string) {
    return this.store.cashoutRequests.filter((item) => item.driverId === driverId);
  }
}
