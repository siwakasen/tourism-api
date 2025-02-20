import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateUpdateTestimonialsDto, PaginationDto } from './testimonials.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiBearerAuth()
@ApiTags('Testimonials')
@Controller('/testimonials')
export class TestimonialsController {
  @Inject(TestimonialsService)
  private readonly testimonialsService: TestimonialsService;

  @ApiResponse({
    status: 200,
    description: 'Successfuly get data testimonials for public',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get('user')
  public async getAllTestimonialsForPublic() {
    console.log('GET ALL TESTIMONIALS [PUBLIC]')
    return await this.testimonialsService.getAllTestimonialsForPublic();
  }


  @ApiResponse({
    status: 200,
    description: 'Successfuly get data testimonials',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @UseGuards(AuthGuard('admin'))
  @Get('')
  public async getAllTestimonials(@Query() query: PaginationDto) {
    console.log('GET ALL TESTIMONIALS')
    return await this.testimonialsService.getAllTestimonials(query);
  }

  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @UseGuards(AuthGuard('admin'))
  @Get('/:id')
  public async getTestimonialsById(@Param('id') id: string) {
    console.log('GET TESTIMONIALS BY ID')
    return await this.testimonialsService.getTestimonialById(id);
  }

  @ApiResponse({
    status: 201,
    description: 'Successfuly create data testimonials',
  })
  @UseGuards(AuthGuard('admin'))
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './dist/apps/testimonials/public/testimonials-images',
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
    type: CreateUpdateTestimonialsDto,
  })
  @Post('')
  public async createTestimonials(
    @Body() body: CreateUpdateTestimonialsDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    console.log('CREATE TESTIMONIAL')
    if (!image) {
      return {
        message: 'Please upload an image',
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
    return await this.testimonialsService.createTestimonial(body, image);
  }

  @ApiResponse({
    status: 201,
    description: 'Successfuly create data testimonials',
  })
  @UseGuards(AuthGuard('admin'))
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './dist/apps/testimonials/public/testimonials-images',
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
    type: CreateUpdateTestimonialsDto,
  })
  @Post('/:id')
  public async updateTestimonial(
    @Param('id') id: string,
    @Body() body: CreateUpdateTestimonialsDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    console.log('UPDATE TESTIMONIAL')
    if (!image) {
      return {
        message: 'Please upload an image',
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
    return await this.testimonialsService.updateTestimonial(id, body, image);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfuly delete data testimonials',
  })
  @UseGuards(AuthGuard('admin'))
  @Delete('/:id')
  public async deleteTestimonial(@Param('id') id: string) {
    console.log('DELETE TESTIMONIAL')
    return await this.testimonialsService.deleteTestimonial(id);
  }
}
