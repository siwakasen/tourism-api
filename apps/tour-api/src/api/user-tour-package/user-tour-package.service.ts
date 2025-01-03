import { TourPackage } from 'libs/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PaginationDto } from './user-tour-package.dto';
import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class UserTourPackageService {
  constructor(private readonly dataSource: DataSource) {}
  @InjectRepository(TourPackage)
  private readonly repository: Repository<TourPackage>;

  public async getAllTourPackage(paginationDto: PaginationDto) {
    try {
      const { page = 1, limit = 10, search = '' } = paginationDto;
      const queryBuilder = this.repository
        .createQueryBuilder('tour_packages')
        .orderBy('tour_packages.created_at', 'DESC');

      // Mengelompokkan kondisi pencarian
      const conditions = ['tour_packages.status = true'];
      const parameters: Record<string, any> = {};

      if (search) {
        conditions.push('tour_packages.package_name ILIKE :search');
        parameters['search'] = `%${search}%`;
      }

      // Menggabungkan semua kondisi jika ada
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
          message: [error.message || 'Internal Server Error'],
          error: 'Internal Server Error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
