import { registerEnumType } from '@nestjs/graphql';

export enum ExtinguisherStatus {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  EXPIRED = 'EXPIRED',
  DECOMMISSIONED = 'DECOMMISSIONED',
}

registerEnumType(ExtinguisherStatus, {
  name: 'ExtinguisherStatus',
  description: 'The possible statuses of a fire extinguisher',
});
