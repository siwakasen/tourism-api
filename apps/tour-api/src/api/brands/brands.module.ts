import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brands } from 'libs/entities';
import { BrandsController } from './brands.controller';
import { BrandsService } from './ brands.service';

@Module({
  imports: [TypeOrmModule.forFeature([Brands])],
  controllers: [BrandsController],
  providers: [BrandsService],
})
export class BrandsModule {}
