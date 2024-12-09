import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BrandsService } from './ brands.service';
import { PaginationDto } from './brands.dto';
import { Controller, Param } from '@nestjs/common';
import { Get, Query } from '@nestjs/common';
@ApiTags('Brands')
@Controller('/brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @ApiResponse({
    status: 200,
    description: 'Successfuly get data brands',
  })
  @Get('')
  public async getBrands(@Query() query: PaginationDto) {
    return await this.brandsService.getAllBrands(query);
  }

  @Get('/:id')
  public async getBrandById(@Param('id') id: string) {
    return await this.brandsService.getBrandById(id);
  }
}
