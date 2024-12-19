import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ExtinguisherStatus } from '../enums/extinguisher-status.enum';

@InputType()
export class CreateExtinguisherInput {
  @Field()
  @IsNotEmpty()
  serialNumber: string;

  @Field()
  @IsNotEmpty()
  type: string;

  @Field({ nullable: true })
  @IsOptional()
  manufacturer?: string;

  @Field()
  manufacturingDate: Date;

  @Field(() => ExtinguisherStatus)
  @IsEnum(ExtinguisherStatus)
  status: ExtinguisherStatus;

  @Field({ nullable: true })
  @IsOptional()
  notes?: string;

  @Field()
  @IsNotEmpty()
  size: string;

  @Field()
  @IsNotEmpty()
  existinguisherType: string;
}