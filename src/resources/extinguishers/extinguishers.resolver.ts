// src/extinguishers/extinguishers.resolver.ts
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ExtinguishersService } from './extinguishers.service';
import { Extinguisher } from './entities/extinguisher.entity';
import { CreateExtinguisherInput } from './dto/create-extinguisher.input';
import { UpdateExtinguisherInput } from './dto/update-extinguisher.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../user/entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver(() => Extinguisher)
@UseGuards(GqlAuthGuard, RolesGuard)
export class ExtinguishersResolver {
  constructor(private readonly extinguishersService: ExtinguishersService) {}
  
  @Mutation(() => Extinguisher)
  @Roles(UserRole.MANAGER)
  createExtinguisher(
    @Args('createExtinguisherInput')
    createExtinguisherInput: CreateExtinguisherInput,
  ) {
    return this.extinguishersService.create(createExtinguisherInput);
  }

  @Query(() => [Extinguisher], { name: 'extinguishers' })
  @Roles(UserRole.MANAGER)
  findAll() {
    return this.extinguishersService.findAll();
  }


  @Query(() => Extinguisher, { name: 'extinguisher' })
  @Roles(UserRole.MANAGER)
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.extinguishersService.findOne(id);
  }

  @Mutation(() => Extinguisher)
  @Roles(UserRole.MANAGER)
  updateExtinguisher(
    @Args('updateExtinguisherInput')
    updateExtinguisherInput: UpdateExtinguisherInput,
  ) {
    return this.extinguishersService.update(
      updateExtinguisherInput.id,
      updateExtinguisherInput,
    );
  }

  @Mutation(() => Boolean)
  @Roles(UserRole.MANAGER)
  removeExtinguisher(@Args('id', { type: () => ID }) id: string) {
    return this.extinguishersService.remove(id);
  }

}