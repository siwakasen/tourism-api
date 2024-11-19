import { Controller, Get, Inject, Query } from '@nestjs/common';
import { TourPackageService } from './tour-package.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from './tour-package.dto';

@ApiTags('Tour Package')
@Controller('/tour-package')
export class TourPackageController {
  @Inject(TourPackageService)
  private readonly tourApiService: TourPackageService;
  @ApiResponse({
    status: 200,
    description: 'Successfuly get data tour package',
  })
  @Get('')
  public async getTourPackage(@Query() query: PaginationDto) {
    return await this.tourApiService.getAllTourPackage(query);
  }
}
