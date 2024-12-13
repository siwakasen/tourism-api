import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Admin } from 'libs/entities/tour_admin/admin.entity';
import { AdminToken } from 'libs/entities/tour_admin/admin.token.entity';
import { AuthRedisService } from './redis.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtStrategy } from '@app/helpers/auth/admin/auth.strategy';
import { AuthHelper } from '@app/helpers/auth/admin/auth.helper';
import { MailModule } from '@app/helpers/mail/mail.module';
import { MailService } from '@app/helpers/mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, AdminToken]),
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
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRedisService,
    MailService,
    JwtStrategy,
    AuthHelper,
  ],
  exports: [AuthService, AuthHelper, JwtStrategy, AuthRedisService], // Export as needed
})
export class AuthModule {}
