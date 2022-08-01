import axios from 'axios';
import { Logger } from '@nestjs/common';

import { HttpResult } from 'src/results/http-result';
import { HttpCommand } from 'src/commands/http/http-command';
import { ResourceService } from '../types/resource-service';

export class HttpResourceService
  implements ResourceService<HttpCommand, HttpResult> {
  async call<T = any>(command: HttpCommand): Promise<HttpResult<T>> {
    const res = await axios.request({
      method: command.method,
      url: this.parseUrl(command.url, command.params || {}),
      params: command.queries,
      data: command.body,
    });

    return {
      status: res.status,
      headers: res.headers,
      body: res.data,
    };
  }

  private parseUrl(url: string, params: Record<string, string>) {
    Logger.warn('Not implemented yet', 'UrlParser');
    return url;
  }
}
