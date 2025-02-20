import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Testimonials } from 'libs/entities/tours/testimonials.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUpdateTestimonialsDto, PaginationDto } from './testimonials.dto';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class TestimonialsService {
  constructor(private readonly dataSource: DataSource) {}

  @InjectRepository(Testimonials)
  private readonly testimonialRepository: Repository<Testimonials>;

  public async getAllTestimonialsForPublic(){
    try {
      const queryBuilder = this.testimonialRepository
        .createQueryBuilder('testimonials')
        .orderBy('testimonials.created_at', 'DESC');

      const [result] = await queryBuilder.getManyAndCount();
      return {
        data: result
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

  public async getTestimonialById(id: string) {
    try {
      const queryBuilder =
        this.testimonialRepository.createQueryBuilder('testimonials');

      const testimonial = await queryBuilder
        .where('testimonials.id = :id', { id })
        .getOne();

      if (!testimonial) {
        throw new Error('Testimonial not found');
      }
      return {
        data: testimonial,
        message: 'Successfully get testimonial by id',
      };
    } catch (error) {
      if (error.message === 'Testimonial not found') {
        throw new HttpException(
          {
            message: ['Testimonial not found'],
            error: 'Testimonial not found',
            statusCode: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
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

  public async updateTestimonial(
    id: string,
    payload: CreateUpdateTestimonialsDto,
    image: Express.Multer.File,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const testimonial: Testimonials =
        await this.testimonialRepository.findOneBy({
          id: id,
        });

      if (!testimonial) {
        throw new Error('Testimonial not found');
      }

      if (testimonial.image) {
        const disPath = path.join(
          './dist/apps/testimonials/public/testimonials-images',
          testimonial.image,
        );
        if (fs.existsSync(disPath)) {
          fs.unlinkSync(disPath);
          console.log('Image deleted successfully');
        }
      }

      this.testimonialRepository.merge(testimonial, {
        ...payload,
        image: image.filename,
      });

      await queryRunner.manager.save(testimonial);
      await queryRunner.commitTransaction();
      return {
        data: testimonial,
        message: 'Testimonial updated successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.message === 'Testimonial not found') {
        throw new HttpException(
          {
            message: ['Testimonial not found'],
            error: 'Testimonial not found',
            statusCode: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
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

  public async deleteTestimonial(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const testimonial: Testimonials =
        await this.testimonialRepository.findOneBy({ id });

      if (!testimonial) {
        throw new Error('Testimonial not found');
      }

      if (testimonial.image) {
        const disPath = path.join(
          './dist/apps/testimonials/public/testimonials-images',
          testimonial.image,
        );
        if (fs.existsSync(disPath)) {
          fs.unlinkSync(disPath);
          console.log('Image deleted successfully');
        }
      }

      await queryRunner.manager.softDelete(Testimonials, id);
      await queryRunner.commitTransaction();

      return {
        data: testimonial,
        message: 'Testimonial deleted successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.message === 'Testimonial not found') {
        throw new HttpException(
          {
            message: ['Testimonial not found'],
            error: 'Testimonial not found',
            statusCode: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
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
