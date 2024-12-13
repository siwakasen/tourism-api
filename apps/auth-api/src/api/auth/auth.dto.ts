import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword, MinLength } from 'class-validator';
import { IsString } from 'class-validator';
import { Admin } from 'libs/entities/tour_admin/admin.entity';

export class LoginReqDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class DataAdminDto {
  @ApiProperty()
  @IsString()
  user: Admin;

  @ApiProperty()
  @IsString()
  token: string;
}

export class LoginResponseDto {
  @ApiProperty()
  @IsString()
  data: DataAdminDto;

  @ApiProperty()
  @IsString()
  success: boolean;
}

export class TokenDto {
  @ApiProperty()
  @IsString()
  public readonly token: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  public readonly token: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  public readonly password: string;
}

export class RegisterDto {
  @ApiProperty({ default: 'test@gmail.com' })
  @IsEmail()
  public readonly email: string;

  @ApiProperty({ default: 'User123' })
  @IsString()
  public readonly username: string;

  @ApiProperty({ default: 'Password123!' })
  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  public readonly password: string;
}

export class requestResetPasswordDto {
  @ApiProperty({ default: 'test@gmail.com' })
  @IsEmail()
  public readonly email: string;
}

export class EmailResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates whether the email was sent successfully.',
  })
  @IsString()
  public readonly success: boolean;

  @ApiProperty({
    example: 'Email sent successfully.',
    description: 'Optional message for additional context.',
  })
  @IsString()
  public readonly message: string;
}
