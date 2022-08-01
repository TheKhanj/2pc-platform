import * as mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { escapeRegExp } from '@shayan/common';

import { Config } from 'src/types/transaction-declaration';
import { ConfigModel } from '../models/config-model';

@Injectable()
export class ConfigService {
  constructor(
    @InjectModel(ConfigModel.name)
    private readonly model: mongoose.Model<ConfigModel>,
  ) {}

  async getById(id: mongoose.Types.ObjectId): Promise<Config> {
    const res = await this.model.findById(id).lean();

    if (!res) {
      throw new mongoose.Error.DocumentNotFoundError(
        `config with id ${id} not found`,
      );
    }

    return res;
  }

  async get(search?: { name?: string }): Promise<Config[]> {
    const query = {} as any;

    if (search?.name) {
      const escaped = escapeRegExp(search.name);

      query.name = new RegExp(`^${escaped}`);
    }

    const res = await this.model.find(query).lean();

    return res;
  }

  async create(config: Omit<Config, 'id'>): Promise<Config> {
    const res = await this.model.create(config);

    return res;
  }

  async update(
    id: mongoose.Types.ObjectId,
    config: Partial<Omit<Config, 'id'>>,
  ): Promise<Config> {
    const res = await this.model.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: config,
      },
      {
        new: true,
      },
    );

    if (!res) {
      throw new mongoose.Error.DocumentNotFoundError(
        `config with id ${id} not found`,
      );
    }

    return res.toObject();
  }

  async delete(id: mongoose.Types.ObjectId): Promise<void> {
    await this.model.findOneAndDelete({
      _id: id,
    });
  }
}
