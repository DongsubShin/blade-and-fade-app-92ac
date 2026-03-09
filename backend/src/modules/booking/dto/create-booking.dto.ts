import { IsUUID, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty()
  @IsUUID()
  barberId: string;

  @ApiProperty()
  @IsUUID()
  serviceId: string;

  @ApiProperty()
  @IsDateString()
  startTime: string;
}