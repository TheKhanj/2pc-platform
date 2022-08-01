import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { StateModel } from './state-model';
import { Config, ConfigStatus, State } from 'src/types/transaction-declaration';

@Schema({ collection: 'Config', minimize: false })
export class ConfigModel implements Config {
  id: Types.ObjectId;

  @Prop({ type: String, required: false, default: null })
  name: string;

  @Prop({ enum: ConfigStatus, required: true, default: ConfigStatus.ACTIVE })
  status: ConfigStatus;

  @Prop({
    type: {
      type: 'object',
    },
    required: false,
    default: {},
  })
  variables: Record<string, any>;

  @Prop({
    type: [StateModel],
  })
  states: State[];
}

const ConfigSchema = SchemaFactory.createForClass(ConfigModel);

ConfigSchema.set('toObject', {
  transform: (doc, ret, options) => {
    ret.id = ret._id;
    delete ret._id;
  },
});
