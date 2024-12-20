import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { User, UserRole, UserStatus } from './entities/user.entity';
import { AdminCreateUserInput } from './dto/admin-create-user.input';
import { AdminUpdateUserInput } from './dto/admin-update-user.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver(() => User)
@UseGuards(GqlAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminUsersResolver {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Mutation(() => User)
  createUser(@Args('input') input: AdminCreateUserInput): Promise<User> {
    return this.adminUsersService.createUser(input);
  }

  @Mutation(() => User)
  updateUser(@Args('input') input: AdminUpdateUserInput): Promise<User> {
    return this.adminUsersService.updateUser(input);
  }

  @Query(() => [User])
  users(
    @Args('role', { nullable: true }) role?: string,
    @Args('status', { nullable: true }) status?: string,
    @Args('search', { nullable: true }) search?: string,
  ): Promise<User[]> {
    return this.adminUsersService.findAll({ role, status, search });
  }

  @Query(() => User)
  user(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.adminUsersService.findOne(id);
  }

  @Mutation(() => User)
  updateUserStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('status', { type: () => UserStatus }) status: UserStatus,
  ): Promise<User> {
    return this.adminUsersService.updateStatus(id, status);
  }

  @Mutation(() => User)
  updateUserRole(
    @Args('id', { type: () => ID }) id: string,
    @Args('role', { type: () => UserRole }) role: UserRole,
  ): Promise<User> {
    return this.adminUsersService.updateRole(id, role);
  }
}
