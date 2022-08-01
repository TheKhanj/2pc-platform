import * as mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ConfigModel } from '../models/config-model';

@Injectable()
export class ConfigService {
  constructor(
    @InjectModel(ConfigModel.name)
    private readonly model: mongoose.Document<ConfigModel>,
  ) {}
}
