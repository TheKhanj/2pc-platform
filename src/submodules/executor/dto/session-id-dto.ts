import { v4 as uuid } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SessionIdDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, example: uuid() })
  sessionId: string;
}
