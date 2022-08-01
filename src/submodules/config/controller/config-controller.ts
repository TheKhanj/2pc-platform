import {
  NotImplementedException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { ConfigIdDto } from '../dto/config-id-dto';
import { ConfigService } from '../service/config-service';
import { CreateConfigDto } from '../dto/create-config-dto';
import { ConfigSearchDto } from '../dto/config-search-dto';

@Controller('/config')
export class ConfigController {
  constructor(private readonly service: ConfigService) {}

  @Get('/search')
  async get(@Param() params: ConfigSearchDto) {
    const res = await this.service.get(params);

    return res;
  }

  @Get('/:configId/getById')
  async getById(@Param() params: ConfigIdDto) {
    const res = await this.service.getById(params.configId);
    return res;
  }

  @Post('/create')
  async create(@Body() config: CreateConfigDto) {
    const res = await this.service.create(config);

    return res;
  }

  @Put('/:configId/updateById')
  async update(@Param() params: ConfigIdDto) {
    throw new NotImplementedException();
  }

  @Delete('/:configId/deleteById')
  async delete(@Param() params: ConfigIdDto) {
    await this.service.delete(params.configId);
  }
}
