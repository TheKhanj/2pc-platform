import { ExpressionEvaluator } from './expression-evaluator';
import { ExtendedVariableStorage } from './extended-variable-storage';

const MOCKED_VALUE = 'MOCKED_VALUE';

describe('ExpressionEvaluator', () => {
  let variableStorage: ExtendedVariableStorage;
  let evaluator: ExpressionEvaluator;

  beforeAll(() => {
    variableStorage = {
      get: jest.fn(async (key) => MOCKED_VALUE),
      set: jest.fn(),
    } as any;

    evaluator = new ExpressionEvaluator(variableStorage);
  });

  it('evaluator should be defined', () => {
    expect(evaluator).toBeDefined();
  });

  it('string evaluation should work', async () => {
    await expect(evaluator.evaluate('asdf')).resolves.toBe('asdf');
  });

  it('path evaluation should work', async () => {
    const query = '$$GLOBAL.something';
    const promise = evaluator.evaluate(query);
    await expect(promise).resolves.toBe(MOCKED_VALUE);
    await promise;
    expect(variableStorage.get).toBeCalledWith(query);
  });

  describe('number evaluation should work', () => {
    it('integer number should work', async () => {
      await expect(evaluator.evaluate(123)).resolves.toBe(123);
    });

    it('floating point number should work', async () => {
      await expect(evaluator.evaluate(123.123)).resolves.toBe(123.123);
    });
  });

  it('array evaluation should work', async () => {
    const query = ['$$GLOBAL.something', 'asdf', 123];
    const promise = evaluator.evaluate(query);
    await expect(promise).resolves.toEqual([MOCKED_VALUE, ...query.slice(1)]);
  });

  it('object evaluation should work', async () => {
    const query = {
      '$$GLOBAL.key': '$$GLOBAL.value',
    };
    const promise = evaluator.evaluate(query);
    await expect(promise).resolves.toEqual({
      MOCKED_VALUE: MOCKED_VALUE,
    });
    await promise;
    expect(variableStorage.get).toBeCalledWith('$$GLOBAL.key');
    expect(variableStorage.get).toBeCalledWith('$$GLOBAL.value');
  });
});
