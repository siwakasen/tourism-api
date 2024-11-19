import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourPackage } from 'libs/entities';
import { TourPackageController } from './tour-package.controller';
import { TourPackageService } from './tour-package.service';

@Module({
  imports: [TypeOrmModule.forFeature([TourPackage])],
  controllers: [TourPackageController],
  providers: [TourPackageService],
})
export class TourPackageModule {}
