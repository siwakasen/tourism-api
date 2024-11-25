import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TourPackage } from 'libs/entities';
import { Repository, DataSource } from 'typeorm';
import { PaginationDto, CreateTourPackageDto } from './tour-package.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TourPackageService {
  constructor(private readonly dataSource: DataSource) {}
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

  public async createTourPackage(payload: CreateTourPackageDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tourPackage: TourPackage = this.repository.create({
        ...payload,
      });

      await queryRunner.manager.save(tourPackage);
      await queryRunner.commitTransaction();

      return {
        data: tourPackage,
        message: 'Tour package created successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.detail.includes('package_name')) {
        throw new HttpException(
          {
            message: ['Tour package name already exists'],
            error: 'Conflict',
            statusCode: HttpStatus.CONFLICT,
          },
          HttpStatus.CONFLICT,
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

  public async uploadImages(id: string, files: Express.Multer.File[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const tourPackage: TourPackage = await this.repository.findOneBy({ id });
      if (!tourPackage) {
        throw new Error('Tour package not found');
      }
      //   delete old images if exist
      if (tourPackage.images) {
        const existingImages = tourPackage.images;
        existingImages.forEach((image) => {
          console.log('image', image);
          if (image === null) return;
          const filePath = path.join('./uploads/tour-images', image);
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath); // Delete file synchronously
              console.log(`Deleted image: ${filePath}`);
            }
          } catch (error) {
            console.error(`Error deleting file ${filePath}:`, error);
          }
        });
      }
      const images = files.map((file) => file.filename);
      tourPackage.images = images;
      await queryRunner.manager.save(tourPackage);

      await queryRunner.commitTransaction();
      return {
        data: tourPackage,
        message: 'Images uploaded successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error.message === 'Tour package not found') {
        throw new HttpException(
          {
            message: ['Tour package not found'],
            error: 'Not Found',
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

  public async updateTourPackage(id: string, payload: CreateTourPackageDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tourPackage: TourPackage = await this.repository.findOneBy({ id });

      if (!tourPackage) {
        throw new Error('Tour package not found');
      }

      this.repository.merge(tourPackage, payload);
      await queryRunner.manager.save(tourPackage);
      await queryRunner.commitTransaction();

      return {
        data: tourPackage,
        message: 'Tour package updated successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.message === 'Tour package not found') {
        throw new HttpException(
          {
            message: ['Tour package not found'],
            error: 'Not Found',
            statusCode: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      if (error.detail.includes('package_name')) {
        throw new HttpException(
          {
            message: ['Tour package name already exists'],
            error: 'Conflict',
            statusCode: HttpStatus.CONFLICT,
          },
          HttpStatus.CONFLICT,
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
