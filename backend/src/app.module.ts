import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { CompatibilityContractModule } from './compatibility/compatibility.module';
import { CompatibilityModule } from './compat/compat.module';
import { DeliveryModule } from './delivery/delivery.module';
import { DocumentsModule } from './documents/documents.module';
import { DriverProfileModule } from './driver-profile/driver-profile.module';
import { EarningsCashoutModule } from './earnings-cashout/earnings-cashout.module';
import { JobsDispatchModule } from './jobs-dispatch/jobs-dispatch.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { PresenceLocationModule } from './presence-location/presence-location.module';
import { RealtimeModule } from './realtime/realtime.module';
import { RiderModule } from './rider/rider.module';
import { SafetyModule } from './safety/safety.module';
import { StorageModule } from './storage/storage.module';
import { TripsModule } from './trips/trips.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    CommonModule,
    StorageModule,
    AuthModule,
    DriverProfileModule,
    OnboardingModule,
    PresenceLocationModule,
    RiderModule,
    DocumentsModule,
    VehiclesModule,
    JobsDispatchModule,
    TripsModule,
    DeliveryModule,
    SafetyModule,
    EarningsCashoutModule,
    NotificationsModule,
    RealtimeModule,
    WorkspaceModule,
    CompatibilityContractModule,
    CompatibilityModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
