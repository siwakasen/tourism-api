import { Injectable } from '@nestjs/common';
import { AuthRedisService } from '../auth/redis.service';
import { RpcException } from '@nestjs/microservices';
import { Admin } from 'libs/entities/tour_admin';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GrpcService {
  constructor(private readonly redisService: AuthRedisService) {}

  @InjectRepository(Admin)
  private readonly repository: Repository<Admin>;

  public getUserGrpc = async (id: string) => {
    try {
      const user = await this.repository.findOne({ where: { id } });
      if (!user) {
        throw new RpcException('User not Found');
      }
      return user;
    } catch (error) {
      console.error(error);
    }
  };
}
