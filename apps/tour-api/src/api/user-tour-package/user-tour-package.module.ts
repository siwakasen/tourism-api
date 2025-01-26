import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTourPackageController } from './user-tour-package.controller';
import { UserTourPackageService } from './user-tour-package.service';
import { TourPackage } from 'libs/entities';
import { MailService } from '@app/helpers/mail/mail.service';
import { MailModule } from '@app/helpers/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([TourPackage]), MailModule],
  controllers: [UserTourPackageController],
  providers: [UserTourPackageService, MailService],
})
export class UserTourPackageModule {}
