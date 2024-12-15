import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brands } from 'libs/entities';
import { BrandsController } from './brands.controller';
import { BrandsService } from './ brands.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthHelper } from '@app/helpers/auth/admin/auth.helper';
import { JwtStrategy } from '@app/helpers/auth/admin/auth.strategy';
@Module({
  imports: [
    TypeOrmModule.forFeature([Brands]),
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
  controllers: [BrandsController],
  providers: [BrandsService, AuthHelper, JwtStrategy],
})
export class BrandsModule {}
