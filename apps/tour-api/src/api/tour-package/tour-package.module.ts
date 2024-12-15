import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourPackage } from 'libs/entities';
import { TourPackageController } from './tour-package.controller';
import { TourPackageService } from './tour-package.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthHelper } from '@app/helpers/auth/admin/auth.helper';
import { JwtStrategy } from '@app/helpers/auth/admin/auth.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([TourPackage]),
    PassportModule.register({ defaultStrategy: 'admin', property: 'admin' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_KEY'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES') },
      }),
    }),
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: 'AUTH_PACKAGE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'auth',
            protoPath: 'contract/auth-api.proto', // Ensure this path is correct
            url: config.get<string>('AUTH_SERVICE'),
          },
        }),
      },
    ]),
  ],
  controllers: [TourPackageController],
  providers: [TourPackageService, AuthHelper, JwtStrategy],
})
export class TourPackageModule {}
