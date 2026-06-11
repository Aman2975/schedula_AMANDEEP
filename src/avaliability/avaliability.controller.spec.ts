import { Test, TestingModule } from '@nestjs/testing';
import { AvaliabilityController } from './avaliability.controller';
import { AvaliabilityService } from './avaliability.service';

describe('AvaliabilityController', () => {
  let controller: AvaliabilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvaliabilityController],
      providers: [AvaliabilityService],
    }).compile();

    controller = module.get<AvaliabilityController>(AvaliabilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
