import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'libs/entities/tour_admin/admin.entity';
import { Repository } from 'typeorm';
import {
  LoginReqDto,
  RegisterDto,
  requestResetPasswordDto,
  ResetPasswordDto,
} from './auth.dto';
import { AuthRedisService } from './redis.service';
import { AuthHelper } from '@app/helpers/auth/admin/auth.helper';
import { AdminToken } from 'libs/entities';
import { MailService } from '@app/helpers/mail/mail.service';
import { FormatErrorInterceptor } from 'libs/helpers/interceptors/exeption.interceptor';

@Injectable()
@UseInterceptors(FormatErrorInterceptor)
export class AuthService {
  constructor(
    private readonly redisService: AuthRedisService,
    private readonly mailService: MailService,
  ) {}
  @InjectRepository(Admin)
  private readonly repository: Repository<Admin>;
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;
  @InjectRepository(AdminToken)
  private readonly adminTokenRepo: Repository<AdminToken>;

  public async register(body: RegisterDto): Promise<void | never> {
    const { email, password, username }: RegisterDto = body;
    const user: Admin = await this.repository.findOne({
      where: { email },
    });

    if (user) {
      throw new HttpException('Email already exist', HttpStatus.CONFLICT);
    }

    const hashedPassword = await this.helper.encodePassword(password);
    const newUser = new Admin();
    newUser.email = email;
    newUser.username = username;
    newUser.password = hashedPassword;
    newUser.createdAt = new Date();

    await this.repository.save(newUser);
  }

  public login = async (body: LoginReqDto) => {
    const { email, password }: LoginReqDto = body;
    const attempsCount = await this.redisService.getValue(email);

    if (+attempsCount > 5) {
      throw new HttpException(
        `Account Blocked, Please Contact Administrator`,
        HttpStatus.FORBIDDEN,
      );
    }
    const user = await this.repository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new HttpException(
        `Email not registered or not verified`,
        HttpStatus.NOT_FOUND,
      );
    }

    const passwordMatched = await this.helper.isPasswordValid(
      user.password,
      password,
    );

    if (!passwordMatched) {
      const newCount = attempsCount ? +attempsCount + 1 : 1;
      await this.redisService.setValue(email, newCount.toString(), 600);
      throw new HttpException(
        `Invalid Password, Count = ${newCount.toString()} `,
        HttpStatus.UNAUTHORIZED,
      );
    }

    delete user.password;
    return {
      success: true,
      data: { user, token: this.helper.generateToken(user) },
    };
  };

  public async requestResetPassword(
    payload: requestResetPasswordDto,
  ): Promise<void> {
    const { email } = payload;

    const user = await this.repository.findOne({
      where: { email },
    });
    if (!user) {
      throw new HttpException(
        `User with email ${email} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const hashedEmail = this.helper.generateResetPwToken(email);
    const url = `${process.env.FRONTEND_URL}/reset-password/` + hashedEmail;
    this.mailService.requestResetPassword({
      email: email,
      url: url,
    });
    const currentDate = new Date();
    await this.adminTokenRepo.save({
      token: hashedEmail,
      expiredAt: currentDate,
    });
  }

  public async verifyToken(token: string): Promise<string | never> {
    return token;
  }

  public async changePassword(payload: ResetPasswordDto) {
    const { token, password }: ResetPasswordDto = payload;

    try {
      const tokenData = await this.helper.decode(token);
      if (!tokenData) {
        throw new HttpException('Token Invalid', HttpStatus.BAD_REQUEST);
      }

      const user = await this.repository.findOne({
        where: { email: tokenData['email'] },
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const hashedPassword = await this.helper.encodePassword(password);
      user.password = hashedPassword;

      user.lastUpdatePassword = new Date();
      user.save();
      return {
        user: user,
        success: true,
        message: 'Success change password',
      };
    } catch (e) {
      throw new HttpException(
        {
          message: [e.message || 'Failed to update password'],
          error: e.message || 'Internal server error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
