import { Test } from '@nestjs/testing';
import { ModuleRef } from '@nestjs/core';

import { CoreModule } from './core-module';
import { SessionFactory } from './session/session-factory';
import { HttpService } from './resources/http/http-service';
import { mockHttpService } from './resources/http/__stubs__/http-service';
import { mockConfig } from 'src/test/mock-config';

describe('Core', () => {
  let moduleRef: Pick<ModuleRef, 'get'>;
  let factory: SessionFactory;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [CoreModule],
    })
      .overrideProvider(HttpService)
      .useValue(mockHttpService)
      .compile();
    factory = moduleRef.get(SessionFactory);
  });

  describe('http', () => {
    it('should pass simple call', async () => {
      const session = await factory.create(mockConfig);

    });

    test.todo('should pass config with no state');
    test.todo('should not pass config with parallel type');

    test.todo('should save each call result in storage');

    describe('should catch error thrown in execution', () => {});
  });

  describe('rabbitmq', () => {
    test.todo('should not pass config with rabbitmq call inside');
  });
});
