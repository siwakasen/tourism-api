import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getEnvPath } from './common/helper/env.helper';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { TourPackageModule } from './api/tour-package/tour-package.module';
import { CarsModule } from './api/cars/cars.module';
import { BrandsModule } from './api/brands/brands.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserCarsModule } from './api/user-cars/user-cars.module';
import { UserTourPackageModule } from './api/user-tour-package/user-tour-package.module';
import { ContactModule } from './api/contact/contact.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/helper`);
console.log('envFilePath:', getEnvPath(`${__dirname}`));
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Membuat config tersedia secara global
    }),
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Adjusted for apps/tour-api/public
      serveRoot: '/public', // Optional: URL prefix for static files
    }),
    TourPackageModule,
    CarsModule,
    BrandsModule,
    UserCarsModule,
    UserTourPackageModule,
    ContactModule,
  ],
})
export class ApiModule {}
