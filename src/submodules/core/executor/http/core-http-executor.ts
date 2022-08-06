import { HttpResult } from '../../results/http-result';
import { HttpCommand } from '../../commands/http-command';
import { CoreExecutor } from '../types/core-executor';
import { HttpService } from 'src/submodules/core/resources/http/http-service';

export class CoreHttpExecutor implements CoreExecutor {
  constructor(
    private readonly httpCommand: HttpCommand,
    private readonly httpService: HttpService,
  ) {}

  async execute(): Promise<HttpResult> {
    return this.httpService.call(this.httpCommand);
  }
}
