import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersAnalyticsService } from './orders-analytics.service';
import { OrdersExportService } from './orders-export.service';
import { Order } from './entities/orders.entity';
import { OrderAnalytics, MonthlyRevenue } from './dto/order-analytics.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { OrderStatus, OrderType } from 'src/common/enums';
import {
  CreateOrderInput,
  CreateServiceRequestInput,
} from './dto/create_orders.input';

@Resolver(() => Order)
@UseGuards(GqlAuthGuard)
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly analyticsService: OrdersAnalyticsService,
    private readonly exportService: OrdersExportService,
  ) {}

  @Mutation(() => Order)
  createOrder(
    @CurrentUser() userId: string,
    @Args('input') input: CreateOrderInput,
  ): Promise<Order> {
    return this.ordersService.createOrder(userId, input);
  }

  @Mutation(() => Order)
  createServiceRequest(
    @CurrentUser() userId: string,
    @Args('input') input: CreateServiceRequestInput,
  ): Promise<Order> {
    return this.ordersService.createServiceRequest(userId, input);
  }

  @Query(() => [Order])
  orders(
    @Args('userId', { nullable: true }) userId?: string,
    @Args('status', { nullable: true }) status?: OrderStatus,
    @Args('orderType', { nullable: true }) orderType?: OrderType,
    @Args('startDate', { nullable: true }) startDate?: Date,
    @Args('endDate', { nullable: true }) endDate?: Date,
  ): Promise<Order[]> {
    return this.ordersService.findAll({
      userId,
      status,
      orderType,
      startDate,
      endDate,
    });
  }

  @Query(() => Order)
  order(@Args('id', { type: () => ID }) id: string): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Query(() => [Order])
  userOrders(@CurrentUser() userId: string): Promise<Order[]> {
    return this.ordersService.findUserOrders(userId);
  }

  @Query(() => [Order])
  extinguisherOrders(
    @Args('extinguisherId', { type: () => ID }) extinguisherId: string,
  ): Promise<Order[]> {
    return this.ordersService.findExtinguisherOrders(extinguisherId);
  }

  @Mutation(() => Order)
  updateOrderStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('status') status: OrderStatus,
  ): Promise<Order> {
    return this.ordersService.updateStatus(id, status);
  }

  @Mutation(() => Order)
  markOrderAsPaid(@Args('id', { type: () => ID }) id: string): Promise<Order> {
    return this.ordersService.markAsPaid(id);
  }

  @Query(() => OrderAnalytics)
  orderAnalytics(
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
  ): Promise<OrderAnalytics> {
    return this.analyticsService.getAnalytics(startDate, endDate);
  }

  @Query(() => [MonthlyRevenue])
  monthlyRevenue(@Args('year') year: number): Promise<MonthlyRevenue[]> {
    return this.analyticsService.getMonthlyRevenue(year);
  }

  @Mutation(() => Boolean)
  async exportOrders(
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
  ): Promise<boolean> {
    await this.exportService.exportToExcel(startDate, endDate);
    return true;
  }
}
