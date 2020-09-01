import { Test, TestingModule } from '@nestjs/testing';
import { BotsController } from './bots.controller';
import { CreateBotDto } from './bots.validators'
import { BotsService } from './bots.service'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bots } from './bots.entity'
import { getRepositoryToken } from '@nestjs/typeorm';
import { configService } from '../config/config.service'
import { HttpException } from '@nestjs/common';
import { ICreateBotBody } from './bots.controller'
import { Request } from 'express'
import { mockRequest } from 'mock-req-res'

const botPayload: ICreateBotBody = {
  name: "testUser",
  type: "ads",
  isActive: true,
  token: "testToken",
}

const req = mockRequest()

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
    const mewBot = await controller.addBot(req, botPayload)
    
    expect(mewBot).toEqual({
      ...botPayload,
      id: 'testId'
    })
  })

  it('should not create new bot', async () => {
    jest.spyOn(service, 'checkThatKeyExist').mockImplementation(async () => true);
    jest.spyOn(service, 'addBot').mockImplementation(async () => ({
      ...botPayload,
      id: 'testId',
      userId: 'testId'
    }));
    try {
      const bot = await controller.addBot(response, botPayload)
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException)
      expect(e.response).toBe('Bot with this token already exist')
      expect(e.status).toBe(409)
    }
  })
});
