import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Brands, Cars, TourPackage } from 'libs/entities';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.get<string>('DATABASE_HOST'),
      port: this.config.get<number>('DATABASE_PORT'),
      database: this.config.get<string>('DATABASE_NAME'),
      username: this.config.get<string>('DATABASE_USER'),
      password: this.config.get<string>('DATABASE_PASSWORD'),
      //   ssl: this.config.get<boolean>('DATABASE_SSL')
      //     ? { rejectUnauthorized: false } // Non-strict SSL (Neon kompatibel dengan ini)
      //     : undefined,
      entities: [TourPackage, Brands, Cars],
      migrations: ['dist/migrations/*.{ts,js}'],
      migrationsTableName: 'typeorm_migrations',
      logger: 'file',
      synchronize: this.config.get<boolean>('SYNCHRONIZE'), // NEVER USE TRUE IN PRODUCTION
    };
  }
}
