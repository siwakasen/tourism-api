import { Injectable } from '@nestjs/common';

@Injectable()
export class TourApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
