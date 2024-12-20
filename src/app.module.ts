import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './AppResolver';
import { DatabaseModule } from './resources/database/database.module';
import { UserModule } from './resources/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { GqlModule } from './resources/graphql/graphql.module';
import { EmailModule } from './resources/email/email.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './resources/auth/auth,module';
import { ExtinguishersModule } from './resources/extinguishers/extinguishers.module';
import { OrdersModule } from './resources/orders/orders.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    HealthModule,
    UserModule,
    GqlModule,
    ConfigModule.forRoot(),
    EmailModule,
    ConfigModule,
    ExtinguishersModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
