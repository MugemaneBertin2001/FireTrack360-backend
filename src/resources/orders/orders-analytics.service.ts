import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/orders.entity';
import { OrderAnalytics, MonthlyRevenue } from './dto/order-analytics.dto';
import { OrderStatus, OrderType, ServiceType } from 'src/common/enums';

@Injectable()
export class OrdersAnalyticsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async getAnalytics(startDate: Date, endDate: Date): Promise<OrderAnalytics> {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .where('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();

    return {
      totalRevenue: this.calculateTotalRevenue(orders),
      totalOrders: orders.length,
      pendingOrders: this.countOrdersByStatus(orders, OrderStatus.PENDING),
      completedOrders: this.countOrdersByStatus(orders, OrderStatus.COMPLETED),
      byOrderType: {
        extinguisherOrders: this.countOrdersByType(
          orders,
          OrderType.EXTINGUISHER,
        ),
        serviceOrders: this.countOrdersByType(orders, OrderType.SERVICE),
      },
      byServiceType: {
        installations: this.countServiceType(orders, ServiceType.INSTALLATION),
        maintenance: this.countServiceType(orders, ServiceType.MAINTENANCE),
        inspections: this.countServiceType(orders, ServiceType.INSPECTION),
        refills: this.countServiceType(orders, ServiceType.REFILL),
        training: this.countServiceType(orders, ServiceType.TRAINING),
      },
    };
  }

  async getMonthlyRevenue(year: number): Promise<MonthlyRevenue[]> {
    const results = await this.orderRepository
      .createQueryBuilder('order')
      .select("DATE_TRUNC('month', order.createdAt)", 'month')
      .addSelect('SUM(order.totalAmount)', 'revenue')
      .addSelect('COUNT(*)', 'orderCount')
      .where('EXTRACT(YEAR FROM order.createdAt) = :year', { year })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    return results.map((result) => ({
      month: result.month,
      revenue: parseFloat(result.revenue),
      orderCount: parseInt(result.orderCount),
    }));
  }

  private calculateTotalRevenue(orders: Order[]): number {
    return orders.reduce((sum, order) => sum + order.totalAmount, 0);
  }

  private countOrdersByStatus(orders: Order[], status: OrderStatus): number {
    return orders.filter((order) => order.status === status).length;
  }

  private countOrdersByType(orders: Order[], type: OrderType): number {
    return orders.filter((order) => order.orderType === type).length;
  }

  private countServiceType(orders: Order[], serviceType: ServiceType): number {
    return orders
      .filter((order) => order.orderType === OrderType.SERVICE)
      .reduce((count, order) => {
        return (
          count +
          order.items.filter((item) => item.serviceType === serviceType).length
        );
      }, 0);
  }
}
