import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Brands } from 'libs/entities';
import { CreateUpdateBrandsDto, PaginationDto } from './brands.dto';

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

  public async createBrands(body: CreateUpdateBrandsDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const brand: Brands = this.repository.create(body);

      await queryRunner.manager.save(brand);
      await queryRunner.commitTransaction();

      return {
        data: brand,
        message: 'Successfully create data brands',
      };
    } catch (error) {
      throw new HttpException(
        {
          message: [error.message || 'Failed to create data brands'],
          error: error.message || 'Internal server error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  public async updateBrands(id: string, body: CreateUpdateBrandsDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const brand: Brands = await this.repository.findOneBy({ id });
      if (!brand) {
        throw new Error('Data brands not found');
      }

      this.repository.merge(brand, body);
      await queryRunner.manager.save(brand);
      await queryRunner.commitTransaction();

      return {
        data: brand,
        message: 'Successfully update data brands',
      };
    } catch (error) {
      if (error.message === 'Data brands not found') {
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
          message: [error.message || 'Failed to update data brands'],
          error: error.message || 'Internal server error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
