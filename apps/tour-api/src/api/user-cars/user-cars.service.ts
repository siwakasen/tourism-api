import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cars } from 'libs/entities';
import { PaginationDto } from './user-cars.dto';

@Injectable()
export class UserCarsService {
  constructor(private readonly dataSource: DataSource) {}

  @InjectRepository(Cars)
  private readonly repository: Repository<Cars>;

  public async getAllCars(paginationDto: PaginationDto) {
    try {
      const { page = 1, limit = 10, search = '' } = paginationDto;
      const queryBuilder = this.repository
        .createQueryBuilder('cars')
        .leftJoinAndSelect('cars.brand', 'brand.id')
        .orderBy('cars.created_at', 'DESC');

      const conditions = ['cars.status = true'];
      const parameters: Record<string, any> = {};
      if (search) {
        conditions.push(`cars.car_name ILIKE :search`);
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
          message: [error.message || 'Failed to fetch data cars'],
          error: error.message || 'Internal server error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getCarsById(id: string) {
    try {
      const result = await this.repository.findOne({
        where: { id, status: true },
      });

      if (!result) {
        throw new Error('Car not found');
      }

      return {
        data: result,
        message: 'Success get data car by id',
      };
    } catch (error) {
      if (error.message === 'Car not found') {
        throw new HttpException(
          {
            message: [error.message || 'Car not found'],
            error: error.message || 'Internal server error',
            statusCode: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        {
          message: [error.message || 'Failed to fetch data cars'],
          error: error.message || 'Internal server error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
