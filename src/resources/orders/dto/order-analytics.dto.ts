import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
class OrderTypeAnalytics {
  @Field(() => Int)
  extinguisherOrders: number;

  @Field(() => Int)
  serviceOrders: number;
}

@ObjectType()
class ServiceTypeAnalytics {
  @Field(() => Int)
  installations: number;

  @Field(() => Int)
  maintenance: number;

  @Field(() => Int)
  inspections: number;

  @Field(() => Int)
  refills: number;

  @Field(() => Int)
  training: number;
}

@ObjectType()
export class OrderAnalytics {
  @Field(() => Float)
  totalRevenue: number;

  @Field(() => Int)
  totalOrders: number;

  @Field(() => Int)
  pendingOrders: number;

  @Field(() => Int)
  completedOrders: number;

  @Field(() => OrderTypeAnalytics)
  byOrderType: OrderTypeAnalytics;

  @Field(() => ServiceTypeAnalytics)
  byServiceType: ServiceTypeAnalytics;
}

@ObjectType()
export class MonthlyRevenue {
  @Field()
  month: string;

  @Field(() => Float)
  revenue: number;

  @Field(() => Int)
  orderCount: number;
}
