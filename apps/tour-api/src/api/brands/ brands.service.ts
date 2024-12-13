import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Brands } from 'libs/entities';
import { PaginationDto } from './brands.dto';

@Injectable()
export class BrandsService {
  constructor(private readonly dataSource: DataSource) {}
  @InjectRepository(Brands)
  private readonly repository: Repository<Brands>;

  public async getAllBrands(paginationDto: PaginationDto) {
    try {
      const { page, limit, search } = paginationDto;
      const queryBuilder = this.repository
        .createQueryBuilder('brands')
        .orderBy('brands.created_at', 'DESC');

      const conditions = [];
      const parameters: Record<string, any> = {};

      if (search) {
        conditions.push(`brands.brand_name LIKE :search`);
        parameters['search'] = `%${search}%`;
      }

      if (conditions.length) {
        queryBuilder.where(conditions.join(' AND '), parameters);
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
          message: [error.message || 'Failed to fetch data brands'],
          error: error.message || 'Internal server error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getBrandById(id: string) {
    try {
      const result: Brands = await this.repository.findOneBy({ id });

      if (!result) {
        throw new Error('Brand not found');
      }

      return {
        data: result,
        message: 'Successfully get data brand',
      };
    } catch (error) {
      if (error.message === 'Brand not found') {
        throw new HttpException(
          {
            message: [error.message],
            error: error.message,
            statusCode: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        {
          message: [error.message || 'Failed to fetch data brand'],
          error: error.message || 'Internal server error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
