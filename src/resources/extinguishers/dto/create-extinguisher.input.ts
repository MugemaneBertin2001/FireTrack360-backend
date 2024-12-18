// src/extinguishers/dto/create-extinguisher.input.ts
import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ExtinguisherStatus } from '../entities/extinguisher.entity';

@InputType()
export class CreateExtinguisherInput {
  @Field()
  @IsNotEmpty()
  serialNumber: string;

  @Field()
  @IsNotEmpty()
  type: string;

  @Field(() => Float)
  @IsNumber()
  capacity: number;

  @Field({ nullable: true })
  @IsOptional()
  manufacturer?: string;

  @Field()
  manufacturingDate: Date;

  @Field()
  nextServiceDate: Date;

  @Field(() => ExtinguisherStatus)
  @IsEnum(ExtinguisherStatus)
  status: ExtinguisherStatus;

  @Field(() => String)
  @IsUUID()
  clientId: string;

  @Field({ nullable: true })
  @IsOptional()
  qrCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  notes?: string;
}
