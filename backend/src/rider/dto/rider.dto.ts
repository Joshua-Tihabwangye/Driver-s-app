import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateRiderTripRequestDto {
  @IsString()
  pickupLabel!: string;

  @IsString()
  pickupAddress!: string;

  @IsString()
  dropoffLabel!: string;

  @IsString()
  dropoffAddress!: string;

  @IsOptional()
  @IsString()
  routeSummary?: string;

  @IsOptional()
  @IsString()
  fareEstimate?: string;

  @IsOptional()
  @IsString()
  distance?: string;
}

export class UpdateRiderTripTrackingDto {
  @IsOptional()
  @IsString()
  status?: 'assigned' | 'driver_en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(240)
  etaMinutes?: number;

  @IsOptional()
  @IsString()
  routeSummary?: string;

  @IsOptional()
  @IsString()
  distance?: string;
}
