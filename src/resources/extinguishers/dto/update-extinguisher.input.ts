import { CreateExtinguisherInput } from './create-extinguisher.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateExtinguisherInput extends PartialType(
  CreateExtinguisherInput,
) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
