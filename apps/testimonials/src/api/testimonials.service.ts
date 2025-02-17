import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Testimonials } from 'libs/entities/tours/testimonials.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUpdateTestimonialsDto, PaginationDto } from './testimonials.dto';

@Injectable()
export class TestimonialsService {
  constructor(private readonly dataSource: DataSource) {}

  @InjectRepository(Testimonials)
  private readonly testimonialRepository: Repository<Testimonials>;

  public async getAllTestimonials(paginationDto: PaginationDto) {
    try {
      const { page = 1, limit = 10, search = '' } = paginationDto;
      const queryBuilder = this.testimonialRepository
        .createQueryBuilder('testimonials')
        .orderBy('testimonials.created_at', 'DESC');

      const conditions = [];
      const parameters: Record<string, any> = {};

      if (search) {
        conditions.push(`testimonials.message ILIKE :search`);
        conditions.push(`testimonials.name ILIKE :search`);
        parameters['search'] = `%${search}%`;
      }

      if (conditions.length) {
        queryBuilder.where(conditions.join(' OR '), parameters);
      }

      const [result, total] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      return {
        data: result,
        meta: {
          totalItems: total,
          currentPage: page,
          totalPages,
          limit,
          hasNextPage,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          message: [error.message || 'Internal Server Error'],
          error: 'Internal Server Error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async createTestimonial(
    payload: CreateUpdateTestimonialsDto,
    image: Express.Multer.File,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const testimonial: Testimonials = this.testimonialRepository.create({
        ...payload,
        image: image.filename,
      });

      await queryRunner.manager.save(testimonial);
      await queryRunner.commitTransaction();
      return {
        data: testimonial,
        message: 'Testimonial created successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        {
          message: [error.message || 'Internal Server Error'],
          error: 'Internal Server Error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
