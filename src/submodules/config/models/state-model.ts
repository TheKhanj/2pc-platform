import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ResourcesModel } from './resources-model';
import { Resource, Resources, State } from 'src/submodules/core/types/transaction-declaration';

@Schema({ _id: false, minimize: false })
export class StateModel implements State {
  @Prop({ type: String, required: true, default: null })
  name: string;

  @Prop({ enum: ['task'], required: false, default: 'task' })
  type: 'task';

  @Prop({ type: mongoose.Schema.Types.Mixed, required: false, default: null })
  result: any;

  @Prop({ type: ResourcesModel, required: true })
  resources: Resources<Resource>;
}

export const StateSchema = SchemaFactory.createForClass(StateModel);
