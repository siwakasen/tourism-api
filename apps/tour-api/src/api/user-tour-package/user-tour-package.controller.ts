import { Controller, Inject, Get, Query } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { UserTourPackageService } from './user-tour-package.service';
import { PaginationDto } from './user-tour-package.dto';

@ApiTags('User Tour Package')
@Controller('/user-tour-packages')
export class UserTourPackageController {
  @Inject(UserTourPackageService)
  private readonly userTourPackageService: UserTourPackageService;

  @ApiResponse({
    status: 200,
    description: 'Successfuly get data tour package',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get('')
  public async getAllUserTourPackage(@Query() query: PaginationDto) {
    return await this.userTourPackageService.getAllTourPackage(query);
  }
}
