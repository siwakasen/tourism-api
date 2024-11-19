import { Injectable } from '@nestjs/common';

@Injectable()
export class TourPackageService {
  getHello(): string {
    return 'Hello World!';
  }
}
