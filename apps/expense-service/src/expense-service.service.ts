import { Injectable } from '@nestjs/common';

@Injectable()
export class ExpenseServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
