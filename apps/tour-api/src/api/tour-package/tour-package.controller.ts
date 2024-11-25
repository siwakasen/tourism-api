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
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadedFiles } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { TourPackageService } from './tour-package.service';
import { ApiResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import {
  PaginationDto,
  CreateTourPackageDto,
  UploadImagesDto,
  updateTourPackageDto,
} from './tour-package.dto';
import { diskStorage } from 'multer';

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

  @ApiResponse({
    status: 200,
    description: 'Successfully uploaded tour package images',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('images', 20, {
      storage: diskStorage({
        destination: './uploads/tour-images', // Directory to save files
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg'); // Adjust extension as needed
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
  @Post('upload-images/:id')
  @ApiBody({
    type: UploadImagesDto,
  })
  public async uploadFiles(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.tourApiService.uploadImages(id, files);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfuly update data tour package',
  })
  @Put('/:id')
  public async updateTourPackage(
    @Param('id') id: string,
    @Body() body: updateTourPackageDto,
  ) {
    return await this.tourApiService.updateTourPackage(id, body);
  }
}
