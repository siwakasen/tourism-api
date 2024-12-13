import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Param,
  HttpException,
  HttpStatus,
  Put,
  Delete,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import {
  PaginationDto,
  CreateUpdateCarsDto,
  UploadImageDto,
  updateStatusDto,
} from './cars.dto';
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
  public async getAllCars(@Query() query: PaginationDto) {
    return await this.carsService.getAllCars(query);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfuly get data cars by id',
  })
  @Get('/:id')
  public async getCarsById(@Param('id') id: string) {
    return await this.carsService.getCarById(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfuly create data cars',
  })
  @Post('')
  public async createCars(@Body() body: CreateUpdateCarsDto) {
    return await this.carsService.createCar(body);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully uploaded tour package thumbnail',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './apps/tour-api/public/car-images',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg');
        },
      }),
      fileFilter: (req, file, cb) => {
        // Validate file type
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new HttpException(
              {
                message: ['Invalid file type. Only images are allowed.'],
                error: 'Not Acceptable',
                statusCode: HttpStatus.NOT_ACCEPTABLE,
              },
              HttpStatus.NOT_ACCEPTABLE,
            ),
            false,
          );
        }
        cb(null, true); // Accept the file if valid
      },
    }),
  )
  @Post('upload-image/:id')
  @ApiBody({
    type: UploadImageDto,
  })
  public async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      return {
        message: 'Please upload an image',
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
    return await this.carsService.uploadImage(id, file);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully delete data cars',
  })
  @Put('/:id')
  public async updateCars(
    @Param('id') id: string,
    @Body() body: CreateUpdateCarsDto,
  ) {
    return await this.carsService.updateCar(id, body);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully delete data cars',
  })
  @Delete('/:id')
  public async deleteCars(@Param('id') id: string) {
    return await this.carsService.deleteCar(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully update status data cars',
  })
  @Patch('/status/:id')
  public async updateStatusCars(
    @Param('id') id: string,
    @Body() body: updateStatusDto,
  ) {
    return await this.carsService.updateCarStatus(id, body);
  }
}
