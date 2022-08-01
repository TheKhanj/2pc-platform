import { Types } from 'mongoose';

import {
  Allow,
  Equals,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

import {
  Config,
  ConfigStatus,
  HttpResource,
  RabbitMQResource,
  Resource,
  Resources,
  State,
  TypeDefinition,
} from 'src/types/transaction-declaration';
import { HttpMethod } from 'src/types/http-method';
import { IsResource } from '../decorators/is-resource';
import { Expression, StringExpression } from 'src/expression/types/expressions';
import { Type } from 'class-transformer';

export class CreateHttpResource implements HttpResource {
  @Equals('http')
  type: 'http';

  @IsEnum(HttpMethod)
  method: HttpMethod;

  @IsUrl()
  @IsNotEmpty()
  url: string;

  @Allow()
  headers: Record<StringExpression, StringExpression>;

  @Allow()
  body?: Expression;

  @Allow()
  params: Record<StringExpression, StringExpression>;

  @Allow()
  queries: Record<StringExpression, StringExpression>;
}

export class CreateRabbitMQResource implements RabbitMQResource {
  @Equals('rabbitmq')
  type: 'rabbitmq';
}

const resources = [
  { type: 'rabbitmq' as const, dto: CreateRabbitMQResource },
  { type: 'http' as const, dto: CreateHttpResource },
];

export class CreateResources implements Resources {
  @IsResource(resources)
  start: Resource;

  @IsResource(resources)
  commit: Resource;

  @IsResource(resources)
  rollback: Resource;
}

export class CreateState implements State {
  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  type: 'task' = 'task';

  @IsOptional()
  result: TypeDefinition;

  @ValidateNested()
  resources: CreateResources;
}

export class CreateConfigDto implements Omit<Config, 'id'> {
  @IsString()
  @IsOptional()
  name: string;

  @IsEnum(ConfigStatus)
  @IsOptional()
  status: ConfigStatus = ConfigStatus.ACTIVE;

  @Allow()
  variables: Record<string, any>;

  @ValidateNested({ each: true })
  @Type(() => CreateState)
  states: CreateState[];
}
