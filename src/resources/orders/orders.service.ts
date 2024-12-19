import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Extinguisher } from '../extinguishers/entities/extinguisher.entity';
import { OrderStatus, OrderType, ServiceType } from 'src/common/enums';
import { Order } from './entities/orders.entity';
import { CreateOrderInput, CreateServiceRequestInput } from './dto/create_orders.input';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Extinguisher)
    private readonly extinguisherRepository: Repository<Extinguisher>,
  ) {}

  async createOrder(userId: string, input: CreateOrderInput): Promise<Order> {
    const { items, notes } = input;
    const order = new Order();
    order.orderNumber = this.generateOrderNumber();
    order.customerId = userId;
    order.orderType = OrderType.EXTINGUISHER;
    order.notes = notes;
    order.status = OrderStatus.PENDING;
    order.isPaid = false;

    const orderItems: OrderItem[] = [];
    let subtotal = 0;

    for (const item of items) {
      const orderItem = new OrderItem();
      orderItem.type = OrderType.EXTINGUISHER;
      orderItem.quantity = item.quantity;

      const extinguisher = await this.extinguisherRepository.findOne({
        where: { id: item.extinguisherId },
      });

      if (!extinguisher) {
        throw new NotFoundException(
          `Extinguisher with ID ${item.extinguisherId} not found`,
        );
      }

      orderItem.extinguisherId = extinguisher.id;
      orderItem.unitPrice = this.calculateExtinguisherPrice(extinguisher);
      orderItem.totalPrice = orderItem.unitPrice * orderItem.quantity;
      subtotal += orderItem.totalPrice;
      orderItems.push(orderItem);
    }

    order.subtotal = subtotal;
    order.tax = this.calculateTax(subtotal);
    order.totalAmount = order.subtotal + order.tax;
    order.items = orderItems;

    return this.orderRepository.save(order);
  }

  async createServiceRequest(
    userId: string,
    input: CreateServiceRequestInput,
  ): Promise<Order> {
    const { services, scheduledDate, notes } = input;

    if (!scheduledDate) {
      throw new BadRequestException(
        'Scheduled date is required for service requests',
      );
    }

    if (new Date(scheduledDate) < new Date()) {
      throw new BadRequestException('Scheduled date cannot be in the past');
    }

    const order = new Order();
    order.orderNumber = this.generateOrderNumber('SRV');
    order.customerId = userId;
    order.orderType = OrderType.SERVICE;
    order.scheduledDate = scheduledDate;
    order.notes = notes;
    order.status = OrderStatus.PENDING;
    order.isPaid = false;

    const orderItems: OrderItem[] = [];
    let subtotal = 0;

    for (const service of services) {
      const orderItem = new OrderItem();
      orderItem.type = OrderType.SERVICE;
      orderItem.quantity = 1;
      orderItem.serviceType = service.serviceType;
      orderItem.serviceDescription = service.description;
      orderItem.location = service.location;
      orderItem.nextServiceDate = service.nextServiceDate;

      if (service.extinguisherId) {
        const extinguisher = await this.extinguisherRepository.findOne({
          where: { id: service.extinguisherId },
        });

        if (!extinguisher) {
          throw new NotFoundException(
            `Extinguisher with ID ${service.extinguisherId} not found`,
          );
        }
        orderItem.extinguisherId = extinguisher.id;
      }

      orderItem.unitPrice = this.calculateServicePrice(service.serviceType);
      orderItem.totalPrice = orderItem.unitPrice;
      subtotal += orderItem.totalPrice;
      orderItems.push(orderItem);
    }

    order.subtotal = subtotal;
    order.tax = this.calculateTax(subtotal);
    order.totalAmount = order.subtotal + order.tax;
    order.items = orderItems;

    return this.orderRepository.save(order);
  }

  async findAll(filters?: {
    userId?: string;
    status?: OrderStatus;
    orderType?: OrderType;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Order[]> {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.extinguisher', 'extinguisher');

    if (filters?.userId) {
      query.andWhere('order.customerId = :userId', { userId: filters.userId });
    }

    if (filters?.status) {
      query.andWhere('order.status = :status', { status: filters.status });
    }

    if (filters?.orderType) {
      query.andWhere('order.orderType = :orderType', {
        orderType: filters.orderType,
      });
    }

    if (filters?.startDate && filters?.endDate) {
      query.andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.extinguisher'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }

    return order;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    return this.orderRepository.save(order);
  }

  async markAsPaid(id: string): Promise<Order> {
    const order = await this.findOne(id);
    order.isPaid = true;
    return this.orderRepository.save(order);
  }

  async findUserOrders(userId: string): Promise<Order[]> {
    return this.findAll({ userId });
  }

  async findExtinguisherOrders(extinguisherId: string): Promise<Order[]> {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .where('items.extinguisherId = :extinguisherId', { extinguisherId });

    return query.getMany();
  }

  private generateOrderNumber(prefix: string = 'ORD'): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  }

  private calculateExtinguisherPrice(extinguisher: Extinguisher): number {
    const basePrice = 100;
    return basePrice;
  }

  private calculateServicePrice(serviceType: ServiceType): number {
    const servicePrices = {
      [ServiceType.INSTALLATION]: 150,
      [ServiceType.MAINTENANCE]: 100,
      [ServiceType.INSPECTION]: 75,
      [ServiceType.REFILL]: 50,
      [ServiceType.TRAINING]: 200,
    };
    return servicePrices[serviceType] || 0;
  }

  private calculateTax(subtotal: number): number {
    const taxRate = 0.18;
    return subtotal * taxRate;
  }
}
