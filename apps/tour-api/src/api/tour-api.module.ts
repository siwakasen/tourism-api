import { Module } from '@nestjs/common';
import { TourApiController } from './tour-package/tour-api.controller';
import { TourApiService } from './tour-package/tour-api.service';

@Module({
  imports: [],
  controllers: [TourApiController],
  providers: [TourApiService],
})
export class TourApiModule {}
