import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUpdateDriversDto, PaginationDto } from './drivers.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';


@ApiBearerAuth()
@ApiTags('Drivers')
@Controller('drivers')
export class DriversController {
  @Inject(DriversService)
  private readonly driversService: DriversService;

@ApiResponse({
    status: 200,
    description: 'Successfuly get data drivers for public',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get('user')
  public async getAllTestimonialsForPublic() {
    console.log('GET ALL DRIVERS [PUBLIC]')
    return await this.driversService.getAllDriversForPublic();
  }


  @ApiResponse({
    status: 200,
    description: 'Successfuly get data drivers',
    })
    @ApiResponse({
    status: 500,
    description: 'Internal server error',
    })
    @UseGuards(AuthGuard('admin'))
    @Get('')
    public async getAllDrivers(@Query() query: PaginationDto) {
        console.log('GET ALL DRIVERS')
        return await this.driversService.getAllDrivers(query);
    }


    @ApiResponse({
        status: 500,
        description: 'Internal server error',
    })
    @UseGuards(AuthGuard('admin'))
    @Get('/:id')
    public async getDriverById(@Param('id') id: string) {
        console.log('GET DRIVER BY ID')
        return await this.driversService.getDriverById(id);
    }

    @ApiResponse({
        status: 201,
        description: 'Successfuly create data drivers',
      })
      @UseGuards(AuthGuard('admin'))
      @ApiConsumes('multipart/form-data')
      @UseInterceptors(
        FileInterceptor('photo_profile', {
          storage: diskStorage({
            destination: './dist/apps/drivers/public/drivers-images',
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
      @ApiBody({
        type: CreateUpdateDriversDto,
      })
      @Post('')
      public async createDriver(
        @Body() body: CreateUpdateDriversDto,
        @UploadedFile() photo_profile: Express.Multer.File,
      ) {
        console.log('CREATE DRIVER')
        if (!photo_profile) {
          return {
            message: 'Please upload an image',
            error: 'Bad Request',
            statusCode: HttpStatus.BAD_REQUEST,
          };
        }
        return await this.driversService.createDriver(body, photo_profile);
      }

      @ApiResponse({
        status: 201,
        description: 'Successfuly update data drivers',
      })
      @UseGuards(AuthGuard('admin'))
      @ApiConsumes('multipart/form-data')
      @UseInterceptors(
        FileInterceptor('photo_profile', {
          storage: diskStorage({
            destination: './dist/apps/drivers/public/drivers-images',
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
      @ApiBody({
        type: CreateUpdateDriversDto,
      })
      @Post('/:id')
      public async updateDriver(
        @Param('id') id: string,
        @Body() body: CreateUpdateDriversDto,
        @UploadedFile() photo_profile: Express.Multer.File,
      ) {
        console.log('UPDATE Driver')
        if (!photo_profile) {
          return {
            message: 'Please upload an image',
            error: 'Bad Request',
            statusCode: HttpStatus.BAD_REQUEST,
          };
        }
        return await this.driversService.updateDriver(id, body, photo_profile);
      }

      @ApiResponse({
        status: 200,
        description: 'Successfuly delete data drivers',
      })
      @UseGuards(AuthGuard('admin'))
      @Delete('/:id')
      public async deleteDriver(@Param('id') id: string) {
        console.log('DELETE TESTIMONIAL')
        return await this.driversService.deleteDriver(id);
      }

}
