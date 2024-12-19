import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ExtinguisherStatus } from '../enums/extinguisher-status.enum';

@Entity('extinguishers')
@ObjectType()
export class Extinguisher {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ unique: true })
  @Field()
  serialNumber: string;

  @Column()
  @Field()
  type: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  manufacturer?: string;

  @Column('timestamp')
  @Field()
  manufacturingDate: Date;

  @Column({
    type: 'enum',
    enum: ExtinguisherStatus,
    default: ExtinguisherStatus.ACTIVE,
  })
  @Field(() => ExtinguisherStatus)
  status: ExtinguisherStatus;

  @Column('text', { nullable: true })
  @Field({ nullable: true })
  notes?: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @Column('varchar', { length: 50 })
  @Field()
  size: string;

  @Column('varchar', { length: 50 })
  @Field()
  existinguisherType: string;
}
