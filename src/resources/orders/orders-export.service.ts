import { Injectable } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Workbook, Worksheet } from 'exceljs';
import { Order } from './entities/orders.entity';
import { Buffer } from 'buffer';

@Injectable()
export class OrdersExportService {
  constructor(private readonly ordersService: OrdersService) {}

  async exportToExcel(startDate: Date, endDate: Date): Promise<Buffer> {
    const orders = await this.ordersService.findAll({ startDate, endDate });
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Orders');

    this.setupWorksheetColumns(worksheet);
    this.addOrdersData(worksheet, orders);
    this.formatWorksheet(worksheet);
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private setupWorksheetColumns(worksheet: Worksheet): void {
    worksheet.columns = [
      { header: 'Order Number', key: 'orderNumber', width: 15 },
      { header: 'Type', key: 'orderType', width: 12 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Total Amount', key: 'totalAmount', width: 15 },
      { header: 'Created Date', key: 'createdAt', width: 20 },
    ];
  }

  private addOrdersData(worksheet: Worksheet, orders: Order[]): void {
    orders.forEach((order) => {
      worksheet.addRow({
        orderNumber: order.orderNumber,
        orderType: order.orderType,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt.toISOString().split('T')[0],
      });
    });
  }

  private formatWorksheet(worksheet: Worksheet): void {
    worksheet.getRow(1).font = { bold: true };
    worksheet.getColumn('totalAmount').numFmt = '#,##0.00';
  }
}
