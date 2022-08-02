export type GlobalPath = '$$GLOBAL' | '$';
export type ResultPath = '$$RESULT';
export type InputPath = '$$INPUT';

export type Path = `${GlobalPath | ResultPath | InputPath}${string}`;

export type StringExpression = Path | string;

export type BooleanExpression = Path | boolean;

export type NumberExpression = Path | number;

export type ObjectExpression = Path | Record<StringExpression, StringExpression>;

export type ArrayExpression<T = any> = Path | T[];

export type Expression =
  | Path
  | StringExpression
  | BooleanExpression
  | NumberExpression
  | ObjectExpression
  | ArrayExpression;
