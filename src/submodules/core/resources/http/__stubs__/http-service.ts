import { HttpResult } from 'src/submodules/core/results/http-result';
import { HttpCommand } from 'src/submodules/core/commands/http-command';
import { ResourceService } from 'src/submodules/core/resources/types/resource-service';

export const mockHttpService: ResourceService<HttpCommand, HttpResult> = {
  call: jest.fn(async () => {
    return {
      status: 200,
      headers: {
        header1: 'RESULT_HEADER_1',
      },
      body: 'RESULT_BODY',
    };
  }),
};
