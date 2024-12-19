import { Injectable } from '@nestjs/common';
import { Order } from './entities/orders.entity';


@Injectable()
export class OrderNotificationsService {
  async sendOrderConfirmation(order: Order): Promise<void> {
    const message = {
      to: order.customer.email,
      subject: `Order Confirmation #${order.orderNumber}`,
      template: 'order-confirmation',
      context: {
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        items: order.items,
      },
    };

    await this.sendNotification(message);
  }

  async sendServiceReminder(order: Order): Promise<void> {
    const message = {
      to: order.customer.email,
      subject: `Service Reminder #${order.orderNumber}`,
      template: 'service-reminder',
      context: {
        orderNumber: order.orderNumber,
        scheduledDate: order.scheduledDate,
        services: order.items,
      },
    };

    await this.sendNotification(message);
  }

  async sendStatusUpdate(order: Order): Promise<void> {
    const message = {
      to: order.customer.email,
      subject: `Order Status Update #${order.orderNumber}`,
      template: 'status-update',
      context: {
        orderNumber: order.orderNumber,
        status: order.status,
        updateDate: new Date(),
      },
    };

    await this.sendNotification(message);
  }

  private async sendNotification(message: any): Promise<void> {
    // Implement your email sending logic here
  }
}
