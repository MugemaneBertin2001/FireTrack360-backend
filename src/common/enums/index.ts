import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum OrderType {
  EXTINGUISHER = 'EXTINGUISHER',
  SERVICE = 'SERVICE',
}

export enum ServiceType {
  INSTALLATION = 'INSTALLATION',
  MAINTENANCE = 'MAINTENANCE',
  INSPECTION = 'INSPECTION',
  REFILL = 'REFILL',
  TRAINING = 'TRAINING',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});

registerEnumType(OrderType, {
  name: 'OrderType',
});

registerEnumType(ServiceType, {
  name: 'ServiceType',
});
