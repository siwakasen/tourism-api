import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Drivers } from 'libs/entities';
import { DataSource, Repository } from 'typeorm';
import { CreateUpdateDriversDto, PaginationDto } from './drivers.dto';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class DriversService {
    constructor (private readonly dataSource: DataSource) {}

    @InjectRepository(Drivers)
    private readonly repository: Repository<Drivers>;

    public async getAllDriversForPublic(){
        try {
          const queryBuilder = this.repository
            .createQueryBuilder('drivers')
            .orderBy('drivers.created_at', 'DESC');

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
    public async getAllDrivers(paginationDto: PaginationDto) {
        try {
          const { page = 1, limit = 10, search = '' } = paginationDto;
          const queryBuilder = this.repository
            .createQueryBuilder('drivers')
            .orderBy('drivers.created_at', 'DESC');

          const conditions = [];
          const parameters: Record<string, any> = {};

          if (search) {
            conditions.push(`drivers.name ILIKE :search`);
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

      public async getDriverById(id:string){
        try {
            const queryBuilder =
              this.repository.createQueryBuilder('drivers');

            const driver = await queryBuilder
              .where('drivers.id = :id', { id })
              .getOne();

            if (!driver) {
              throw new Error('Driver not found');
            }
            return {
              data: driver,
              message: 'Successfully get driver by id',
            };
          } catch (error) {
            if (error.message === 'Driver not found') {
              throw new HttpException(
                {
                  message: ['Driver not found'],
                  error: 'Driver not found',
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

      public async createDriver(
        payload: CreateUpdateDriversDto,
        photo_profile:Express.Multer.File
      ){
        const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
              const driver: Drivers = this.repository.create({
                ...payload,
                photo_profile: photo_profile.filename,
              });

              await queryRunner.manager.save(driver);
              await queryRunner.commitTransaction();
              return {
                data: driver,
                message: 'Driver created successfully',
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

      public async updateDriver(
        id:string,
        payload:CreateUpdateDriversDto,
        photo_profile?:Express.Multer.File
      ){
        const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
              const driver: Drivers =
                await this.repository.findOneBy({
                  id: id,
                });

              if (!driver) {
                throw new Error('Driver not found');
              }

              if (photo_profile && driver.photo_profile) {
                const disPath = path.join(
                  './dist/apps/drivers/public/drivers-images',
                  driver.photo_profile,
                );
                if (fs.existsSync(disPath)) {
                  fs.unlinkSync(disPath);
                  console.log('Image deleted successfully');
                }
                this.repository.merge(driver, {
                  ...payload,
                  photo_profile: photo_profile.filename,
                });
              }else{
                this.repository.merge(driver, {
                  ...payload,
                });
              }


              await queryRunner.manager.save(driver);
              await queryRunner.commitTransaction();
              return {
                data: driver,
                message: 'Driver updated successfully',
              };
            } catch (error) {
              await queryRunner.rollbackTransaction();
              if (error.message === 'Driver not found') {
                throw new HttpException(
                  {
                    message: ['Driver not found'],
                    error: 'Driver not found',
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

      public async deleteDriver(id:string){
        const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
              const driver: Drivers =
                await this.repository.findOneBy({ id });

              if (!driver) {
                throw new Error('Driver not found');
              }

              if (driver.photo_profile) {
                const disPath = path.join(
                  './dist/apps/drivers/public/drivers-images',
                  driver.photo_profile,
                );
                if (fs.existsSync(disPath)) {
                  fs.unlinkSync(disPath);
                  console.log('Image deleted successfully');
                }
              }

              await queryRunner.manager.softDelete(Drivers, id);
              await queryRunner.commitTransaction();

              return {
                data: driver,
                message: 'Driver deleted successfully',
              };
            } catch (error) {
              await queryRunner.rollbackTransaction();
              if (error.message === 'Driver not found') {
                throw new HttpException(
                  {
                    message: ['Driver not found'],
                    error: 'Driver not found',
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
