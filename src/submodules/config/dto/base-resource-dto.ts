import { IsEnum, IsNotEmpty } from 'class-validator';

import { BaseResource } from 'src/types/transaction-declaration';

export class BaseResourceDto implements BaseResource {
  @IsEnum(['http', 'rabbitmq'])
  @IsNotEmpty()
  type: 'http' | 'rabbitmq';
}
