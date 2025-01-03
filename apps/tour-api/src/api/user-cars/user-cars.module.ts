import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cars } from 'libs/entities';
import { UserCarsController } from './user-cars.controller';
import { UserCarsService } from './user-cars.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cars])],
  controllers: [UserCarsController],
  providers: [UserCarsService],
})
export class UserCarsModule {}
