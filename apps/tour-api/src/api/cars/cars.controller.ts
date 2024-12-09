import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Put,
  Param,
  HttpException,
  HttpStatus,
  Delete,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { PaginationDto, CreateCarsDto } from './cars.dto';
import { CarsService } from './cars.service';

@ApiTags('Cars')
@Controller('/cars')
export class CarsController {
  @Inject(CarsService)
  private readonly carsService: CarsService;

  @ApiResponse({
    status: 200,
    description: 'Successfuly get data cars',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get('')
  public async getCars(@Query() query: PaginationDto) {
    return await this.carsService.getAllCars(query);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfuly create data cars',
  })
  @Post('')
  public async createCars(@Body() body: CreateCarsDto) {
    return await this.carsService.createCar(body);
  }
}
