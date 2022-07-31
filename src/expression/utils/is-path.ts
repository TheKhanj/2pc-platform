import { Path } from '../types/expressions';

export function isPath(value: string): value is Path {
  return value.startsWith('$');
}
