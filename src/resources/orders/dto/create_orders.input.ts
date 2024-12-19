import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceType } from 'src/common/enums';
import { FindOperator } from 'typeorm';

@InputType()
export class CreateOrderItemInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  productId: string;

  @Field()
  @IsNotEmpty()
  quantity: number;
  extinguisherId: string | FindOperator<string>;
}
@InputType()
export class OrderItemInput {
  @Field()
  @IsUUID()
  extinguisherId: string;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

@InputType()
export class CreateOrderInput {
  @Field(() => [OrderItemInput])
  @ValidateNested({ each: true })
  @Type(() => OrderItemInput)
  items: OrderItemInput[];

  @Field({ nullable: true })
  @IsOptional()
  notes?: string;
}

@InputType()
export class ServiceRequestItemInput {
  @Field(() => ServiceType)
  @IsNotEmpty()
  serviceType: ServiceType;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  extinguisherId?: string;

  @Field()
  @IsNotEmpty()
  location: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  nextServiceDate?: Date;
}

@InputType()
export class CreateServiceRequestInput {
  @Field(() => [ServiceRequestItemInput])
  @ValidateNested({ each: true })
  @Type(() => ServiceRequestItemInput)
  services: ServiceRequestItemInput[];

  @Field()
  @IsNotEmpty()
  scheduledDate: Date;

  @Field({ nullable: true })
  @IsOptional()
  notes?: string;
}
