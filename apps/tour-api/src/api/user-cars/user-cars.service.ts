import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cars } from 'libs/entities';
import { PaginationDto, requestOrderCarRentalDto } from './user-cars.dto';
import { MailService } from '@app/helpers/mail/mail.service';

@Injectable()
export class UserCarsService {
  constructor(private readonly mailService: MailService) {}

  @InjectRepository(Cars)
  private readonly repository: Repository<Cars>;

  public async getAllCars(paginationDto: PaginationDto) {
    try {
      const { page = 1, limit = 10, search = '' } = paginationDto;
      const queryBuilder = this.repository
        .createQueryBuilder('cars')
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
      const queryBuilder = this.repository.createQueryBuilder('cars');

      const car = await queryBuilder.where('cars.id = :id', { id }).getOne();

      if (!car) {
        throw new Error('Car not found');
      }

      return {
        data: car,
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

  public async requestCarRental(payload: requestOrderCarRentalDto) {
    const { car_id } = payload;
    try {
      const queryBuilder = this.repository.createQueryBuilder('cars');

      const car = await queryBuilder
        .where('cars.id = :id', { id: car_id })
        .getOne();
      if (!car) {
        throw new Error('Car not found');
      }

      this.mailService.sendOrderCarRentalToOwner({
        car_name: ` ${car.car_name}`,
        name: payload.name,
        email: payload.email,
        country_of_origin: payload.country_of_origin ?? '-',
        phone_number: payload.phone_number ?? '-',
        number_of_person:
          (payload.number_of_person ?? payload.number_of_person < 1)
            ? 1
            : payload.number_of_person,
        pickup_location: payload.pickup_location,
        start_date: payload.start_date,
        end_date: payload.end_date,
        pickup_time: payload.pickup_time,
        additional_message: payload.additional_message ?? '-',
      });

      this.mailService.sendConfirmationCarBookingToCustomer({
        car_name: car.car_name,
        name: payload.name,
        email: payload.email,
      });
      return {
        message: 'Success order car rental',
      };
    } catch (error) {
      if (error.message === 'Car not found') {
        throw new HttpException(
          {
            message: ['Car not found'],
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
}
