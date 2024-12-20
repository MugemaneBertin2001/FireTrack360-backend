import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
import { OrderStatus } from 'src/common/enums';

@InputType()
export class OrderFiltersInput {
  @Field(() => OrderStatus, { nullable: true })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  userId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
