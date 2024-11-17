import { Module } from '@nestjs/common';
import { TourApiController } from './tour_package.controller';
import { TourApiService } from './tourpackage.service';

@Module({
  imports: [],
  controllers: [TourApiController],
  providers: [TourApiService],
})
export class TourApiModule {}
