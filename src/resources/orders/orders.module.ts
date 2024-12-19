import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersResolver } from './orders.resolver';
import { OrdersService } from './orders.service';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/orders.entity';
import { Extinguisher } from '../extinguishers/entities/extinguisher.entity';
import { OrdersAnalyticsService } from './orders-analytics.service';
import { OrdersExportService } from './orders-export.service';
import { OrderNotificationsService } from './orders-notifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Extinguisher])],
  providers: [
    OrdersService,
    OrdersResolver,
    OrdersAnalyticsService,
    OrderNotificationsService,
    OrdersExportService,
  ],
  exports: [OrdersService, OrdersAnalyticsService, OrdersExportService],
})
export class OrdersModule {}
