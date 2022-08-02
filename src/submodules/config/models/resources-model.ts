import { Prop } from '@nestjs/mongoose';

import { HttpResourceModel } from './http-resource-model';
import { Resource, Resources } from 'src/submodules/core/types/transaction-declaration';

export class ResourcesModel implements Resources<Resource> {
  @Prop({ type: HttpResourceModel, required: true })
  start: Resource;

  @Prop({ type: HttpResourceModel, required: true })
  commit: Resource;

  @Prop({ type: HttpResourceModel, required: true })
  rollback: Resource;
}
