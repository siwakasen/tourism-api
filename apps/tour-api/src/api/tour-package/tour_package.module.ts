import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourPackage } from 'libs/entities';
import { TourPackageController } from './tour_package.controller';
import { TourPackageService } from './tourpackage.service';

@Module({
  imports: [TypeOrmModule.forFeature([TourPackage])],
  controllers: [TourPackageController],
  exports: [TourPackageService],
  providers: [],
})
export class TourPackageModule {}
