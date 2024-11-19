import { Controller, Get } from '@nestjs/common';
import { TourPackageService } from './tour-package.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Tour Package')
@Controller('/tour-package')
export class TourPackageController {
  constructor(private readonly tourApiService: TourPackageService) {}

  @ApiResponse({
    status: 200,
    description: 'Successfuly get data Parent',
  })
  // @UseGuards(AuthGuard('admin'))
  @Get('')
  public async getTourPackage() {
    return '';
  }
}
