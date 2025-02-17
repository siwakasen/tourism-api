import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
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
    description: 'Successfuly get data testimonials',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @UseGuards(AuthGuard('admin'))
  @Get('')
  public async getAllTestimonials(@Query() query: PaginationDto) {
    return await this.testimonialsService.getAllTestimonials(query);
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
    if (!image) {
      return {
        message: 'Please upload an image',
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
    return await this.testimonialsService.createTestimonial(body, image);
  }
}
