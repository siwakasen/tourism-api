import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TourPackage } from 'libs/entities';
import { Repository } from 'typeorm';
import { PaginationDto } from './tour-package.dto';

@Injectable()
export class TourPackageService {
  @InjectRepository(TourPackage)
  private readonly repository: Repository<TourPackage>;
  getHello(): string {
    return 'Hello World!';
  }

  public async getAllTourPackage(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search = '' } = paginationDto;

    const queryBuilder = this.repository
      .createQueryBuilder('tour_packages')
      .orderBy('tour_packages.created_at', 'DESC');

    // Mengelompokkan kondisi pencarian
    const conditions = [];
    const parameters: Record<string, any> = {};

    if (search) {
      conditions.push('tour_packages.package_name LIKE :search');
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
  }
}
