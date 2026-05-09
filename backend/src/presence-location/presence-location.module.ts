import { Module } from '@nestjs/common';
import { DriverProfileModule } from '../driver-profile/driver-profile.module';
import { PresenceLocationController } from './presence-location.controller';
import { PresenceLocationService } from './presence-location.service';

@Module({
  imports: [DriverProfileModule],
  controllers: [PresenceLocationController],
  providers: [PresenceLocationService],
  exports: [PresenceLocationService],
})
export class PresenceLocationModule {}
