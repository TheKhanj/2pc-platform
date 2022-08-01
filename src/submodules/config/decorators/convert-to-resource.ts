import { Type } from 'class-transformer';

import { BaseResource } from 'src/types/transaction-declaration';
import { BaseResourceDto } from '../dto/base-resource-dto';

export function ConvertToResource(
  resources: { type: BaseResource['type']; dto: any }[],
): PropertyDecorator {
  return Type(() => BaseResourceDto, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'type',
      subTypes: resources.map((res) => ({ name: res.type, value: res.dto })),
    },
  });
}
