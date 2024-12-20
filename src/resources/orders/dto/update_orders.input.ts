import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateOrderInput } from './create_orders.input';
import { OrderStatus } from 'src/common/enums';

@InputType()
export class UpdateOrderInput extends PartialType(CreateOrderInput) {
  @Field(() => OrderStatus, { nullable: true })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
