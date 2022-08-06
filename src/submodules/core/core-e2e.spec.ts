import { Test } from '@nestjs/testing';
import { ModuleRef } from '@nestjs/core';

import { CoreModule } from './core-module';
import { SessionFactory } from './session/session-factory';
import { HttpService } from './resources/http/http-service';
import { mockHttpService } from './resources/http/__stubs__/http-service';
import { mockConfig, mockHttpResource, mockState } from 'src/test/mock-config';
import { Session } from './session/abstract/session';
import { SESSION_TOKEN } from './constants';
import { ConfigType, State } from './types/transaction-declaration';
import { HttpCommand } from './commands/http-command';

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
    describe('should pass simple call', () => {
      let session: Session;

      beforeAll(async () => {
        const moduleRef = await factory.create(mockConfig, {});
        session = moduleRef.get<Session>(SESSION_TOKEN);
      });

      it('session should be defined', () => {
        expect(session).toBeDefined();
      });

      it('session id should be defined', () => {
        expect(session.id).toBeDefined();
      });

      it('should call start and commit', async () => {
        await session.start();
        expect(mockHttpService.call).toBeCalledTimes(2);
      });
    });

    it('should pass config with no state', async () => {
      const moduleRef = await factory.create(
        {
          ...mockConfig,
          states: [],
        },
        {},
      );
      const session = moduleRef.get<Session>(SESSION_TOKEN);
      await session.start();
      expect(mockHttpService.call).toBeCalledTimes(0);
    });

    it('should not pass config with parallel type', async () => {
      await expect(
        factory.create(
          {
            ...mockConfig,
            type: ConfigType.PARALLEL,
          },
          {},
        ),
      ).rejects.toThrow();
    });

    describe('expression and storage should work', () => {
      let session: Session;

      beforeAll(async () => {
        mockHttpService.call.mockClear();
        const state1: State = {
          ...mockState,
          name: 'state1',
          resources: {
            start: {
              type: 'http',
              method: 'GET',
              url: '/base/:param1/:param2',
              params: {
                param1: '$$GLOBAL.var1',
                param2: '$$INPUT.input1',
              },
            },
            commit: {
              type: 'http',
              method: 'GET',
              url: '/base/:param1',
              params: {
                param1: '$$RESULT.state1.status',
              },
              queries: {
                '$$RESULT.state1.status': '$$RESULT.state1.status',
              },
              body: {
                '$$RESULT.state1.status': '$$RESULT.state1.status',
              },
              headers: {
                '$$RESULT.state1.status': '$$RESULT.state1.status',
              },
            },
            rollback: {
              type: 'http',
              method: 'GET',
              url: '/base/:param1',
              params: {
                param1: '$$RESULT.state1.status',
              },
            },
          },
        };

        const state2: State = {
          ...mockState,
          name: 'state2',
          resources: {
            start: {
              type: 'http',
              method: 'GET',
              url: '/base/:param1/:param2/:param3',
              params: {
                param1: '$$RESULT.state1.status',
                param2: '$$GLOBAL.var1',
                param3: '$$INPUT.input1',
              },
            },
            commit: {
              type: 'http',
              method: 'GET',
              url: '/base',
            },
            rollback: {
              type: 'http',
              method: 'GET',
              url: '/base',
            },
          },
        };

        const moduleRef = await factory.create(
          {
            ...mockConfig,
            variables: {
              var1: 'VARIABLE-1',
            },
            states: [state1, state2],
          },
          {
            input1: 'INPUT-1',
          },
        );

        session = moduleRef.get<Session>(SESSION_TOKEN);
      });

      it('states should be called with proper data', async () => {
        await session.start();

        const state1StartHttpCommand: HttpCommand = mockHttpService.call.mock.calls[0].at(
          0,
        ) as any;
        expect(state1StartHttpCommand.params).toMatchObject({
          param1: 'VARIABLE-1',
          param2: 'INPUT-1',
        });

        const state2StartHttpCommand: HttpCommand = mockHttpService.call.mock.calls[1].at(
          0,
        ) as any;
        expect(state2StartHttpCommand.params).toMatchObject({
          param1: 200,
          param2: 'VARIABLE-1',
          param3: 'INPUT-1',
        });

        const state1CommitHttpCommand: HttpCommand = mockHttpService.call.mock.calls[2].at(
          0,
        ) as any;
        expect(state1CommitHttpCommand.params).toMatchObject({
          param1: 200,
        });
        const state1CommitResultObj = { 200: 200 };
        expect(state1CommitHttpCommand.body).toMatchObject(
          state1CommitResultObj,
        );
        expect(state1CommitHttpCommand.queries).toMatchObject(
          state1CommitResultObj,
        );
        expect(state1CommitHttpCommand.headers).toMatchObject(
          state1CommitResultObj,
        );
      });
    });

    describe('should catch error thrown in execution', () => {});
  });

  describe('rabbitmq', () => {
    test.todo('should not pass config with rabbitmq call inside');
  });
});
