import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Order } from './entities/orders.entity';

@Injectable()
export class OrderNotificationsService {
  private readonly logger = new Logger(OrderNotificationsService.name);

  constructor(private readonly mailerService: MailerService) {}

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
    try {
      this.logger.log(
        `Notification sent to ${message.to} with subject "${message.subject}"`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send notification to ${message.to}`,
        error.stack,
      );
    }
  }
}
