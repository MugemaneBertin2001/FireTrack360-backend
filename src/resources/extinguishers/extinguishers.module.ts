import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtinguishersService } from './extinguishers.service';
import { ExtinguishersResolver } from './extinguishers.resolver';
import { Extinguisher } from './entities/extinguisher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Extinguisher])],
  providers: [ExtinguishersResolver, ExtinguishersService],
  exports: [ExtinguishersService],
})
export class ExtinguishersModule {}
