import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  LoginReqDto,
  LoginResponseDto,
  RegisterDto,
  ResetPasswordDto,
  SendEmailDto,
  TokenDto,
} from './auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { MailService } from '@app/helpers/mail/mail.service';

@ApiTags('Auth Controller')
@ApiBearerAuth() //
@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly mailService: MailService,
  ) {}

  @ApiResponse({ status: 200, description: 'Token valid' })
  @ApiBadRequestResponse({ description: 'Token Invalid' })
  @Post('verify-token')
  private async verifyToken(@Body() body: TokenDto): Promise<string | never> {
    return await this.service.verifyToken(body.token);
  }

  @ApiResponse({ status: 200, description: 'Token valid' })
  @ApiBadRequestResponse({ description: 'Token Invalid' })
  @Post('register')
  private async register(@Body() body: RegisterDto) {
    return await this.service.register(body);
  }

  @ApiResponse({ status: 201, description: 'Success change Password' })
  @ApiBadRequestResponse({
    description: 'Token Invalid OR password not strong enough',
  })
  @Post('reset-password')
  private async resetPassword(
    @Body() body: ResetPasswordDto,
  ): Promise<void | never> {
    await this.service.changePassword(body);
  }

  @ApiResponse({
    status: 200,
    description: 'Success Login.',
    type: LoginResponseDto,
  })
  @Post('login')
  private async login(@Body() body: LoginReqDto) {
    const response = await this.service.login(body);
    return response;
  }

  @Get('test')
  @UseGuards(AuthGuard('admin'))
  private async test(@Request() req: any): Promise<void> {
    console.log(req.admin);
  }

  @Post('send')
  async sendEmail(@Body() body: SendEmailDto) {
    await this.mailService.sendMail(
      body.to,
      body.subject,
      body.text,
      body.html,
    );
    return { message: 'Email sent successfully!' };
  }
}
