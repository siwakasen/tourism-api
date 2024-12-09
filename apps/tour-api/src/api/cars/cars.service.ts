import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cars } from 'libs/entities';
import { PaginationDto, CreateCarsDto } from './cars.dto';

@Injectable()
export class CarsService {
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

      const conditions = [];
      const parameters: Record<string, any> = {};
      if (search) {
        conditions.push(`cars.car_name LIKE :search`);
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

  public async createCar(payload: CreateCarsDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const brand = await queryRunner.manager.findOne('brands', {
        where: { id: payload.brand_id },
      });

      if (!brand) {
        throw new Error('Brand not found');
      }
      const car: Cars = this.repository.create({
        ...payload,
        brand,
      });

      await queryRunner.manager.save(car);
      await queryRunner.commitTransaction();

      return {
        data: {
          ...car,
          brand,
        },
        message: 'Car created successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.message === 'Brand not found') {
        throw new HttpException(
          {
            message: ['Brand not found'],
            error: 'Brand not found',
            statusCode: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        {
          message: [error.message || 'Failed to create new car'],
          error: error.message || 'Internal server error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
