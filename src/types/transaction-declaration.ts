import { Method } from 'axios';

import { Expression, StringExpression } from './expressions';

export type TypeDefinition = any;

export type HttpResource = {
  type: 'http';
  method: Method;
  url: string;
  headers: Record<StringExpression, StringExpression>;
  body: Expression;
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

export type Transaction = {
  id: any;
  name: string;
  status: 'active' | 'inactive';
  states: State[];
};
