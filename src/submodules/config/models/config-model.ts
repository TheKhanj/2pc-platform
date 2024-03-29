import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  Config,
  ConfigStatus,
  ConfigType,
  State,
} from 'src/submodules/core/types/transaction-declaration';
import { StateSchema } from './state-model';

@Schema({ collection: 'Config', minimize: false })
export class ConfigModel implements Config {
  id: mongoose.Types.ObjectId;

  @Prop({ enum: ConfigType, required: true, default: 'sequential' })
  type: ConfigType;

  @Prop({ type: String, required: false, default: null })
  name: string;

  @Prop({ enum: ConfigStatus, required: true, default: ConfigStatus.ACTIVE })
  status: ConfigStatus;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    required: false,
    default: {},
  })
  variables: Record<string, any>;

  @Prop({
    type: [StateSchema],
  })
  states: State[];
}

export const ConfigSchema = SchemaFactory.createForClass(ConfigModel);

ConfigSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    ret.id = ret._id;
    delete ret._id;
  },
});
