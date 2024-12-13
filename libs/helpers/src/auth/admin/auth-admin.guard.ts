import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard as Guard, IAuthGuard } from '@nestjs/passport';
import { Admin } from 'libs/entities';

@Injectable()
export class JwtAuthGuardAdmin extends Guard('admin') implements IAuthGuard {
  public handleRequest(err: unknown, user: Admin): any {
    console.log('user', user);
    return user;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('masuk');
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user ? true : false;
  }
}
