import { Injectable, NotFoundException } from '@nestjs/common';
import { TripsService } from '../trips/trips.service';
import { InMemoryStoreService } from '../storage/in-memory-store.service';

@Injectable()
export class JobsDispatchService {
  constructor(
    private readonly store: InMemoryStoreService,
    private readonly tripsService: TripsService,
  ) {}

  list(driverId: string, query: { status?: string; type?: string }) {
    let jobs = this.store.jobs.filter((item) => item.driverId === driverId);
    if (query.status) {
      jobs = jobs.filter((item) => item.status === query.status);
    }
    if (query.type) {
      jobs = jobs.filter((item) => item.type === query.type);
    }
    return jobs;
  }

  getActive(driverId: string) {
    return this.store.jobs.find(
      (item) => item.driverId === driverId && ['accepted', 'in_progress'].includes(item.status),
    ) ?? null;
  }

  accept(driverId: string, jobId: string) {
    const job = this.store.jobs.find((item) => item.id === jobId && item.driverId === driverId);
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    job.status = 'accepted';
    const trip = this.tripsService.startFromJob(driverId, job.id, job.type);
    this.tripsService.markEnRoute(driverId, trip.id);
    return {
      job,
      trip,
    };
  }

  reject(driverId: string, jobId: string, reason = '') {
    const job = this.store.jobs.find((item) => item.id === jobId && item.driverId === driverId);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    job.status = 'rejected';
    return { jobId, rejected: true, reason };
  }
}
