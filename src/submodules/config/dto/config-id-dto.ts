import * as mongoose from 'mongoose';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoObjectId, TransformStringToObjectId } from '@shayan/common';

export class ConfigIdDto {
  @ApiProperty({
    type: String,
    example: new mongoose.Types.ObjectId(),
  })
  @TransformStringToObjectId()
  @IsMongoObjectId()
  @IsNotEmpty()
  configId: mongoose.Types.ObjectId;
}
