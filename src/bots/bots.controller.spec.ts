import { Test, TestingModule } from '@nestjs/testing';
import { BotsController } from './bots.controller';
import { CreateBotDto } from './bots.validators'
import { BotsService } from './bots.service'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bots } from './bots.entity'
import { getRepositoryToken } from '@nestjs/typeorm';
import { configService } from '../config/config.service'

const botPayload: CreateBotDto = {
  name: "testUser",
  type: "ads",
  isActive: true,
  token: "testToken",
  userId: "testUserID"
}

describe('Bots Controller', () => {
  let controller: BotsController;
  let service: BotsService
  let typeOrm: TypeOrmModule

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BotsController],
      providers: [BotsService,
        {
          provide: getRepositoryToken(Bots),
          useValue: {}
        },
      ],
    }).compile();

    controller = module.get<BotsController>(BotsController);
    service = module.get<BotsService>(BotsService)
  });

  // it('should be defined', () => {
  //   expect(controller).toBeDefined();
  // });
  it('should create new bot', async () => {
    jest.spyOn(service, 'checkThatKeyExist').mockImplementation(async () => false);
    jest.spyOn(service, 'addBot').mockImplementation(async () => ({
      ...botPayload,
      id: 'testId'
    }));
    const mewBot = await controller.addBot(botPayload)
    
    expect(mewBot).toEqual({
      ...botPayload,
      id: 'testId'
    })
  })

  it('should should not create new bot', async () => {
    jest.spyOn(service, 'checkThatKeyExist').mockImplementation(async () => true);
    jest.spyOn(service, 'addBot').mockImplementation(async () => ({
      ...botPayload,
      id: 'testId'
    }));
    try {
      const bot = await controller.addBot(botPayload)
    } catch (e) {
      console.log(e)
      expect(e).toContain({
        status: 409,
        message: 'Bot with this token already exist'
      })
    }
  })
});
