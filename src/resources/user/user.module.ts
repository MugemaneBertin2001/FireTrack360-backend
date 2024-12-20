import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { DatabaseModule } from '../database/database.module';
import { DataSource } from 'typeorm';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { HashingService } from './hashing.service';
import { EmailModule } from '../email/email.module';
import { AuthJwtService } from './jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { AdminUsersService } from './admin-users.service';
import { AdminUsersResolver } from './admin-users.resolver';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User]),
    EmailModule,
    JwtModule,
  ],
  providers: [
    {
      provide: UserRepository,
      useFactory: (dataSource: DataSource) => {
        return new UserRepository(dataSource);
      },
      inject: [DataSource],
    },
    UserService,
    HashingService,
    UserResolver,
    AuthJwtService,
    Logger,
    AdminUsersService,
    AdminUsersResolver,
  ],
  exports: [
    UserService,
    HashingService,
    UserRepository,
    AuthJwtService,
    AdminUsersService,
    AdminUsersResolver,
  ],
})
export class UserModule {}
