import { HttpResourceService } from './http-resource-service';

describe('HttpResourceService', () => {
  let httpResource: HttpResourceService;

  beforeAll(() => {
    httpResource = new HttpResourceService();
  });

  it('service should be defined', () => {
    expect(HttpResourceService).toBeDefined();
  });

  describe('url parsing should work properly', () => {
    let parse: (url: string, params: any) => string;

    beforeAll(() => {
      parse = httpResource['parseUrl'];
    });

    it('basic url parsing should work', () => {
      const res = parse('/:param1/:param2/:param3', {
        param1: 'value1',
        param2: 'value2',
        param3: 'value3',
      });

      expect(res).toBe('/value1/value2/value3');
    });

    it('should escape regex special characters', () => {
      const res = parse('/:param$/something', {
        param$: 'value',
      });

      expect(res).toBe('/value/something');
    });
  });
});
