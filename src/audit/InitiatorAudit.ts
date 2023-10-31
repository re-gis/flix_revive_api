/* eslint-disable */
import { SerializeOptions } from '@nestjs/common';
import { TimestampAudit } from './TimestampAudit';

@SerializeOptions({
  strategy: 'exposeAll',
})
export abstract class InitiatorAudit extends TimestampAudit {
  constructor() {
    super();
  }

  createdAt: Date;
  updatedAt: Date;
}
