import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { OrderStatus, OrderType } from 'src/common/enums';
import { User } from 'src/resources/user/entities/user.entity';


registerEnumType(OrderStatus, { name: 'OrderStatus' });
registerEnumType(OrderType, { name: 'OrderType' });

@ObjectType()
@Entity('orders')
export class Order {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ length: 50 })
  orderNumber: string;

  @Field(() => OrderType)
  @Column({
    type: 'enum',
    enum: OrderType,
  })
  orderType: OrderType;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @Field()
  @Column()
  customerId: string;

  @Field(() => [OrderItem])
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
  })
  items: OrderItem[];

  @Field(() => OrderStatus)
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  tax: number;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  scheduledDate?: Date;

  @Field()
  @Column({ default: false })
  isPaid: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
export { OrderStatus, OrderType };

