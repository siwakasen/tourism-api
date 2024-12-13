import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cars } from 'libs/entities';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cars])],
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {}
