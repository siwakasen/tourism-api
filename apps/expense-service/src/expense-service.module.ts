import { Module } from '@nestjs/common';
import { ExpenseServiceController } from './expense-service.controller';
import { ExpenseServiceService } from './expense-service.service';

@Module({
  imports: [],
  controllers: [ExpenseServiceController],
  providers: [ExpenseServiceService],
})
export class ExpenseServiceModule {}
