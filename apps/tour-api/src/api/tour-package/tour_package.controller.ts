import { Controller, Get } from '@nestjs/common';
import { TourApiService } from './tourpackage.service';

@Controller()
export class TourApiController {
  constructor(private readonly tourApiService: TourApiService) {}

  @Get()
  getHello(): string {
    return this.tourApiService.getHello();
  }
}
