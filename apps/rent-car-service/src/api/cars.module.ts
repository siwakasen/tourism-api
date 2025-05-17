import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cars } from 'libs/entities';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthHelper } from '@app/helpers/auth/admin/auth.helper';
import { JwtStrategy } from '@app/helpers/auth/admin/auth.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cars]),
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
            protoPath: 'contract/auth-service.proto', // Ensure this path is correct
            url: config.get<string>('AUTH_SERVICE'),
          },
        }),
      },
    ]),
  ],
  controllers: [CarsController],
  providers: [CarsService, AuthHelper, JwtStrategy],
})
export class CarsModule {}
