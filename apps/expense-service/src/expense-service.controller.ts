import { Controller, Get } from '@nestjs/common';
import { ExpenseServiceService } from './expense-service.service';

@Controller()
export class ExpenseServiceController {
  constructor(private readonly expenseServiceService: ExpenseServiceService) {}

  @Get()
  getHello(): string {
    return this.expenseServiceService.getHello();
  }
}
