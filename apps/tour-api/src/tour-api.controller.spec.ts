import { Test, TestingModule } from '@nestjs/testing';
import { TourApiController } from './api/tour-package/tour_package.controller';
import { TourApiService } from './api/tour-package/tourpackage.service';

describe('TourApiController', () => {
  let tourApiController: TourApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TourApiController],
      providers: [TourApiService],
    }).compile();

    tourApiController = app.get<TourApiController>(TourApiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(tourApiController.getHello()).toBe('Hello World!');
    });
  });
});
