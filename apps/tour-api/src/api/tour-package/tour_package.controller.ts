import { Controller, Get } from '@nestjs/common';
import { TourPackageService } from './tourpackage.service';

@Controller()
export class TourPackageController {
  constructor(private readonly tourApiService: TourPackageService) {}

  @Get()
  getHello(): string {
    return this.tourApiService.getHello();
  }
}
