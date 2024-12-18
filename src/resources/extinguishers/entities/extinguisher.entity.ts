// src/extinguishers/entities/extinguisher.entity.ts
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { User } from 'src/resources/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';


export enum ExtinguisherStatus {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  EXPIRED = 'EXPIRED',
  DECOMMISSIONED = 'DECOMMISSIONED',
}

@Entity('extinguishers')
@ObjectType()
export class Extinguisher {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  serialNumber: string;

  @Column()
  @Field()
  type: string;

  @Column('decimal')
  @Field(() => Float)
  capacity: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  manufacturer?: string;

  @Column('timestamp')
  @Field()
  manufacturingDate: Date;

  @Column('timestamp', { nullable: true })
  @Field({ nullable: true })
  lastServiceDate?: Date;

  @Column('timestamp')
  @Field()
  nextServiceDate: Date;

  @Column({
    type: 'enum',
    enum: ExtinguisherStatus,
    default: ExtinguisherStatus.ACTIVE,
  })
  @Field(() => ExtinguisherStatus)
  status: ExtinguisherStatus;

  @Column('uuid')
  @Field(() => ID)
  clientId: string;

  @ManyToOne(() => User)
  @Field(() => User)
  client: User;

  @Column({ nullable: true })
  @Field({ nullable: true })
  qrCode?: string;

  @Column('text', { nullable: true })
  @Field({ nullable: true })
  notes?: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
