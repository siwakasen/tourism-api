import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseServiceController } from './expense-service.controller';
import { ExpenseServiceService } from './expense-service.service';

describe('ExpenseServiceController', () => {
  let expenseServiceController: ExpenseServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ExpenseServiceController],
      providers: [ExpenseServiceService],
    }).compile();

    expenseServiceController = app.get<ExpenseServiceController>(ExpenseServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(expenseServiceController.getHello()).toBe('Hello World!');
    });
  });
});
