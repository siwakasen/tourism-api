import { Test, TestingModule } from '@nestjs/testing';
import { TourPackageController } from './api/tour-package/tour-package.controller';
import { TourPackageService } from './api/tour-package/tour-package.service';

describe('TourApiController', () => {
  let tourApiController: TourPackageController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TourPackageController],
      providers: [TourPackageService],
    }).compile();

    tourApiController = app.get<TourPackageController>(TourPackageController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(tourApiController.getTourPackage()).toBe('Hello World!');
    });
  });
});
