import {
  Allow,
  Equals,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import {
  Config,
  ConfigStatus,
  HttpResource,
  RabbitMQResource,
  Resource,
  Resources,
  State,
  TypeDefinition,
} from 'src/submodules/core/types/transaction-declaration';
import {
  Expression,
  StringExpression,
} from 'src/submodules/core/expression/types/expressions';
import { HttpMethod } from 'src/submodules/core/types/http-method';
import { ConvertToResource } from '../decorators/convert-to-resource';

export class CreateHttpResource implements HttpResource {
  @Equals('http')
  @ApiProperty({ enum: ['http'], required: true })
  type: 'http';

  @IsEnum(HttpMethod)
  @ApiProperty({ enum: HttpMethod, required: true })
  method: HttpMethod;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'https://google.com' })
  url: string;

  @Allow()
  @ApiProperty({ example: { referer: '127.0.0.1' } })
  headers?: Record<StringExpression, StringExpression>;

  @Allow()
  @ApiProperty({ required: false, example: {} })
  body?: Expression;

  @Allow()
  @ApiProperty({ required: false, example: {} })
  params?: Record<StringExpression, StringExpression>;

  @Allow()
  @ApiProperty({ required: false, example: {} })
  queries?: Record<StringExpression, StringExpression>;
}

export class CreateRabbitMQResource implements RabbitMQResource {
  @Equals('rabbitmq')
  @ApiProperty({ enum: ['rabbitmq'], required: true })
  type: 'rabbitmq';
}

const resources = [
  { type: 'rabbitmq' as const, dto: CreateRabbitMQResource },
  { type: 'http' as const, dto: CreateHttpResource },
];

export class CreateResources implements Resources {
  @ValidateNested()
  @ConvertToResource(resources)
  @ApiProperty({
    type: CreateHttpResource,
    required: true,
  })
  start: Resource;

  @ValidateNested()
  @ConvertToResource(resources)
  @ApiProperty({
    type: CreateHttpResource,
    required: true,
  })
  commit: Resource;

  @ValidateNested()
  @ConvertToResource(resources)
  @ApiProperty({
    type: CreateHttpResource,
    required: true,
  })
  rollback: Resource;
}

export class CreateState implements State {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, example: 'check-balance' })
  @Type(() => String)
  name: string;

  @IsOptional()
  @ApiProperty({ enum: ['task'] })
  @Type(() => String)
  type: 'task' = 'task';

  @Allow()
  @IsOptional()
  @ApiProperty({ required: false })
  result: TypeDefinition;

  @ValidateNested()
  @Type(() => CreateResources)
  @ApiProperty({ type: CreateResources })
  resources: CreateResources;
}

export class CreateConfigDto implements Omit<Config, 'id'> {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, required: false, example: 'transfer-money' })
  name: string;

  @IsEnum(ConfigStatus)
  @IsOptional()
  @ApiProperty({
    enum: ConfigStatus,
    required: false,
    default: ConfigStatus.ACTIVE,
  })
  status: ConfigStatus = ConfigStatus.ACTIVE;

  @Allow()
  @ApiProperty({
    example: {
      var1: 'value1',
      var2: 123,
      var3: true,
    },
  })
  variables: Record<string, any>;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CreateState)
  @ApiProperty({ type: [CreateState] })
  states: CreateState[];
}
