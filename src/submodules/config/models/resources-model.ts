import { Prop } from '@nestjs/mongoose';

import { Resource, Resources } from 'src/types/transaction-declaration';
import { HttpResourceModel } from './http-resource-model';

export class ResourcesModel implements Resources<Resource> {
  @Prop({ type: HttpResourceModel, required: true })
  start: Resource;

  @Prop({ type: HttpResourceModel, required: true })
  commit: Resource;

  @Prop({ type: HttpResourceModel, required: true })
  rollback: Resource;
}
