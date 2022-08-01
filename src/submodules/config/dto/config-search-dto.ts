import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ConfigSearchDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, required: false, example: 'tran' })
  name?: string;
}
