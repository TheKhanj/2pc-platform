import { Expression, StringExpression } from './expression';

export type TypeDefinition = any;

export type ResourceDeclaration =
  | {
      type: 'http';
      headers: Record<StringExpression, StringExpression>;
      body: Expression;
      params: Record<StringExpression, StringExpression>;
      queries: Record<StringExpression, StringExpression>;
    }
  | {
      type: 'rabbitmq';
    };

export type Resources = {
  start: ResourceDeclaration;
  commit: ResourceDeclaration;
  rollback: ResourceDeclaration;
};

export type StateDeclaration = {
  name: string;
  type: 'task';
  result: TypeDefinition;
  resources: Resources[];
};

export type TransactionDeclaration = {
  id: any;
  name: string;
  status: 'active' | 'inactive';
  states: StateDeclaration[];
};
