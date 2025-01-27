import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cars } from 'libs/entities';
import { UserCarsController } from './user-cars.controller';
import { UserCarsService } from './user-cars.service';
import { MailService } from '@app/helpers/mail/mail.service';
import { MailModule } from '@app/helpers/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cars]), MailModule],
  controllers: [UserCarsController],
  providers: [UserCarsService, MailService],
})
export class UserCarsModule {}
