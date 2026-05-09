import { Module } from '@nestjs/common';
import { DocumentsModule } from '../documents/documents.module';
import { TripsModule } from '../trips/trips.module';
import { JobsDispatchController } from './jobs-dispatch.controller';
import { JobsDispatchService } from './jobs-dispatch.service';

@Module({
  imports: [TripsModule, DocumentsModule],
  controllers: [JobsDispatchController],
  providers: [JobsDispatchService],
  exports: [JobsDispatchService],
})
export class JobsDispatchModule {}
