import { cartesian } from '@shayan/common';

import { Storage } from '../storage/storage';
import { AsyncStorage } from '../storage/async-storage';
import { ExtendedVariableStorage } from './extended-variable-storage';
import { permutate } from '../utils/permutate';

const indexTypes = ['bracket', 'dot'] as const;
const quoteTypes = ['single', 'double'] as const;

function getStringQuote(key: string, type: typeof quoteTypes[number]) {
  if (type === 'single') {
    return `'${key}'`;
  }
  return `"${key}"`;
}

function getStringSelector(
  key: string,
  type: typeof indexTypes[number],
  quoteType: typeof quoteTypes[number],
) {
  switch (type) {
    case 'bracket':
      return `[${getStringQuote(key, quoteType)}]`;
    case 'dot':
      return `.${key}`;
    default:
      throw new Error();
  }
}

function getNumberSelector(key: number, type: typeof indexTypes[number]) {
  switch (type) {
    case 'bracket':
      return `[${key}]`;
    case 'dot':
      return `.${key}`;
    default:
      throw new Error();
  }
}

describe('ExtendedVariableStorage', () => {
  let storage: ExtendedVariableStorage;

  beforeAll(() => {
    storage = new ExtendedVariableStorage(new AsyncStorage(new Storage()));
  });

  it('storage should be defined', () => {
    expect(storage).toBeDefined();
  });

  describe('convertQueryToArr', () => {
    let fn: (query: string) => (string | number)[];

    beforeAll(() => {
      fn = (storage as any).convertQueryToArr;
    });

    it('should pass string index', () => {
      const keys = ['asdf', 'ASDF', 'asdf-asdf', 'asdf123'];
      keys.forEach((key) => {
        indexTypes.forEach((type) => {
          quoteTypes.forEach((quoteType) => {
            expect(fn(getStringSelector(key, type, quoteType))).toEqual([key]);
          });
        });
      });
    });

    it('should pass number index', () => {
      const keys = [123];
      keys.forEach((key) => {
        indexTypes.forEach((type) => {
          expect(fn(getNumberSelector(key, type))).toEqual([key]);
        });
      });
    });

    it('should pass strange cases', () => {
      const keys = ['asdf"', 'asdf""', '"asdf"', '"asdf'];
      keys.forEach((key) => {
        expect(fn(getStringSelector(key, 'bracket', 'single'))).toEqual([key]);
      });
    });

    it('should pass nested structure', () => {
      // Do not increase this array size,
      // It slows down test dramatically
      const keys = [123, 'asdf', 'asdf-asdf', 'asdf123'];
      permutate(keys).forEach((perm) => {
        const carts = cartesian(
          ...new Array(keys.length).fill(null).map((_) => indexTypes as any),
        );

        carts.forEach((cart) => {
          const path = perm
            .map((key, index) => {
              const type = cart[index];
              if (typeof key === 'string') {
                return getStringSelector(key, type, 'single');
              }
              return getNumberSelector(key, type);
            })
            .join('');

          expect(fn(path)).toEqual(perm);
        });
      });
    });
  });
});
