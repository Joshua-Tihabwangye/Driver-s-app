import { IsOptional, IsString } from 'class-validator';

export class VerifyDeliveryQrDto {
  @IsString()
  qrValue!: string;

  @IsOptional()
  @IsString()
  scanType?: string;
}
