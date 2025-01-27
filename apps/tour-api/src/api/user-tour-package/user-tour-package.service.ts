import { TourPackage } from 'libs/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PaginationDto,
  requestOrderPackageTourDto,
} from './user-tour-package.dto';
import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MailService } from '@app/helpers/mail/mail.service';

@Injectable()
export class UserTourPackageService {
  constructor(private readonly mailService: MailService) {}
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

  public async getTourPackageById(id: string) {
    try {
      const result = await this.repository.findOne({
        where: { id, status: true },
      });
      if (!result) {
        throw new Error('Tour package not found');
      }

      return {
        data: result,
        message: 'Successfully get data tour package by id',
      };
    } catch (error) {
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
    }
  }

  public async requestOrder(payload: requestOrderPackageTourDto) {
    const { package_id } = payload;
    try {
      const result = await this.repository.findOne({
        where: { id: package_id, status: true },
      });
      if (!result) {
        throw new Error('Tour package not found');
      }
      this.mailService.sendOrderPackageTourToOwner({
        package_name: result.package_name,
        name: payload.name,
        email: payload.email,
        country_of_origin: payload.country_of_origin ?? '-',
        phone_number: payload.phone_number ?? '-',
        number_of_adults:
          (payload.number_of_person[0] ?? payload.number_of_person[0] < 1)
            ? 1
            : payload.number_of_person[0],
        number_of_children: payload.number_of_person[1] ?? 0,
        start_date: payload.start_date,
        pickup_location: payload.pickup_location,
        pickup_time: payload.pickup_time ?? '-',
        additional_condition: payload.additional_condition ?? '-',
      });

      this.mailService.sendConfirmationBookingToCustomer({
        package_name: result.package_name,
        name: payload.name,
        email: payload.email,
      });

      return {
        message: 'Successfully send emails to owner and customer',
      };
    } catch (error) {
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
      console.error(`Error sending order package tour email to `, error);
      return {
        message: 'Failed to send order package tour to owner',
      };
    }
  }
}
