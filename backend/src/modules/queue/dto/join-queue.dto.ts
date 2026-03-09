import { IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class JoinQueueDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  barberId?: string;
}