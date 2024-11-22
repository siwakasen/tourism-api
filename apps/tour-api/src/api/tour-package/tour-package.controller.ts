import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { TourPackageService } from './tour-package.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto, CreateTourPackageDto } from './tour-package.dto';

@ApiTags('Tour Package')
@Controller('/tour-package')
export class TourPackageController {
  @Inject(TourPackageService)
  private readonly tourApiService: TourPackageService;
  @ApiResponse({
    status: 200,
    description: 'Successfuly get data tour package',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get('')
  public async getTourPackage(@Query() query: PaginationDto) {
    return await this.tourApiService.getAllTourPackage(query);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfuly create data tour package',
  })
  @Post('')
  public async createTourPackage(@Body() body: CreateTourPackageDto) {
    return await this.tourApiService.createTourPackage(body);
  }
}
