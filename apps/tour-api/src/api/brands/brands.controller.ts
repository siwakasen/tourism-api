import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BrandsService } from './ brands.service';
import { CreateUpdateBrandsDto, PaginationDto } from './brands.dto';
import {
  Get,
  Query,
  UseGuards,
  Controller,
  Post,
  Body,
  Put,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('Brands')
@Controller('/brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @ApiResponse({
    status: 200,
    description: 'Successfuly get data brands',
  })
  @Get('')
  @UseGuards(AuthGuard('admin'))
  public async getBrands(@Query() query: PaginationDto) {
    return await this.brandsService.getAllBrands(query);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfuly post data brands',
  })
  @Post('')
  @UseGuards(AuthGuard('admin'))
  public async createBrands(@Body() body: CreateUpdateBrandsDto) {
    return await this.brandsService.createBrands(body);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully update data brands',
  })
  @UseGuards(AuthGuard('admin'))
  @Put('/:id')
  public async updateCars(
    @Param('id') id: string,
    @Body() body: CreateUpdateBrandsDto,
  ) {
    return await this.brandsService.updateBrands(id, body);
  }
}
