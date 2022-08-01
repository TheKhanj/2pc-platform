import { Prop, Schema } from '@nestjs/mongoose';

import { Resource, Resources, State } from 'src/types/transaction-declaration';
import { ResourcesModel } from './resources-model';

@Schema({ minimize: false })
export class StateModel implements State {
  @Prop({ type: String, required: false, default: null })
  name: string;

  @Prop({ enum: ['task'], required: false, default: 'task' })
  type: 'task';

  @Prop({ type: { type: 'object' }, required: false, default: null })
  result: any;

  @Prop({ type: ResourcesModel, required: true })
  resources: Resources<Resource>;
}
