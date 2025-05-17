import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcService } from './grpc.service';
import { Admin } from 'libs/entities/tour_admin';

@Controller()
export class GrpcController {
  @Inject(GrpcService)
  private readonly grpcService: GrpcService;

  @GrpcMethod('AuthService', 'GetUser')
  async getUser(body: { id: string }): Promise<Admin> {
    const user = await this.grpcService.getUserGrpc(body.id);
    return user;
  }
}
