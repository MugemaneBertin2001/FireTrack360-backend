import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  CLIENT = 'Client',
  TECHNICIAN = 'Technician',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

registerEnumType(UserStatus, {
  name: 'UserStatus',
});

@ObjectType()
@Entity('users')
@Unique(['email', 'phone'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @Column({ default: false })
  @Field()
  verified: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  verificationToken: string;

  @Column({ type: 'enum', enum: UserRole, nullable: false })
  @Field(() => UserRole)
  role: UserRole;

  @Column({ unique: true, nullable: true })
  phone?: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  @Field()
  updatedAt: Date;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  @Field(() => UserStatus)
  status: UserStatus;
}
