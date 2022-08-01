import { Types } from 'mongoose';
import { Method } from 'axios';

import { Expression, StringExpression } from '../expression/types/expressions';

export type TypeDefinition = any;

export type HttpResource = {
  type: 'http';
  method: Method;
  url: string;
  headers: Record<StringExpression, StringExpression>;
  body?: Expression;
  params: Record<StringExpression, StringExpression>;
  queries: Record<StringExpression, StringExpression>;
};

export type RabbitMQResource = {
  type: 'rabbitmq';
};

export type Resource = HttpResource | RabbitMQResource;

export type Resources<R = Resource> = {
  start: R;
  commit: R;
  rollback: R;
};

export type State = {
  name: string;
  type: 'task';
  result: TypeDefinition;
  resources: Resources;
};

export enum ConfigStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export type Config = {
  id: Types.ObjectId;
  name: string;
  status: ConfigStatus;
  variables: Record<string, any>;
  states: State[];
};
