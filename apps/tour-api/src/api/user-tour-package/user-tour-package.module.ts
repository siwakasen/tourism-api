import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTourPackageController } from './user-tour-package.controller';
import { UserTourPackageService } from './user-tour-package.service';
import { TourPackage } from 'libs/entities';

@Module({
  imports: [TypeOrmModule.forFeature([TourPackage])],
  controllers: [UserTourPackageController],
  providers: [UserTourPackageService],
})
export class UserTourPackageModule {}
