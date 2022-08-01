import * as mongoose from 'mongoose';
import { Prop, Schema } from '@nestjs/mongoose';

import { HttpMethod } from 'src/types/http-method';
import { Expression } from 'src/expression/types/expressions';
import { HttpResource } from 'src/types/transaction-declaration';

@Schema({ minimize: false })
export class HttpResourceModel implements HttpResource {
  @Prop({ enum: ['http'], required: true })
  type: 'http';

  @Prop({ type: { type: 'object' }, required: false, default: {} })
  headers: Record<string, string>;

  @Prop({ type: { type: 'object' }, required: false, default: {} })
  params: Record<string, string>;

  @Prop({ type: { type: 'object' }, required: false, default: {} })
  queries: Record<string, string>;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: HttpMethod })
  method: HttpMethod;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: false, default: undefined })
  body?: Expression;
}
