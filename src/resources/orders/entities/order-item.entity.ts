import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './orders.entity';
import { Extinguisher } from '../../extinguishers/entities/extinguisher.entity';
import { OrderType } from 'src/common/enums';
import { ServiceType } from 'src/common/enums';

@ObjectType()
@Entity('order_items')
export class OrderItem {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Field()
  @Column()
  orderId: string;

  @Field(() => OrderType)
  @Column({
    type: 'enum',
    enum: OrderType,
  })
  type: OrderType;

  @Field(() => Extinguisher, { nullable: true })
  @ManyToOne(() => Extinguisher, { nullable: true })
  @JoinColumn({ name: 'extinguisher_id' })
  extinguisher?: Extinguisher;

  @Field({ nullable: true })
  @Column({ nullable: true })
  extinguisherId?: string;

  @Field(() => ServiceType, { nullable: true })
  @Column({
    type: 'enum',
    enum: ServiceType,
    nullable: true,
  })
  serviceType?: ServiceType;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Field()
  @Column('int')
  quantity: number;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  serviceDescription?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  nextServiceDate?: Date;
}
