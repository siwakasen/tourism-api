import { Controller, Inject } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { UserCarsService } from './user-cars.service';
import { PaginationDto } from './user-cars.dto';
import { Query, Get } from '@nestjs/common';

@ApiTags('User Cars')
@Controller('/user-cars')
export class UserCarsController {
  @Inject(UserCarsService)
  private readonly userCarsService: UserCarsService;

  @ApiResponse({
    status: 200,
    description: 'Successfuly get data cars',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get('')
  public async getAllUserCars(@Query() query: PaginationDto) {
    return await this.userCarsService.getAllCars(query);
  }
}
