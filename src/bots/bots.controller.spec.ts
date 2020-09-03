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

const botPayload: {
  name: string,
  type: "ads" | "music",
  isActive: boolean,
  token: string
} = {
  name: "testUser",
  type: "ads",
  isActive: true,
  token: "testToken",
}

const fakeUser = {
  userId: 'testUserId',
  discordToken: 'testToken',
  iat: 9999,
  exp: 9999
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
    const addBotMock = jest.spyOn(service, 'addBot').mockImplementation(async () => ({
      ...botPayload,
      userId: 'testUserId',
      id: 'testBotId'
    }));

    const mewBot = await controller.addBot(fakeUser, botPayload)

    expect(addBotMock).toBeCalledWith({
      userId: 'testUserId',
      ...botPayload
    })

    expect(mewBot).toEqual({
      ...botPayload,
      id: 'testBotId',
      userId: 'testUserId',
    })
  })

  it('should not create new bot', async () => {
    jest.spyOn(service, 'checkThatKeyExist').mockImplementation(async () => true);
    jest.spyOn(service, 'addBot').mockImplementation(async () => ({
      ...botPayload,
      id: 'testBotId',
      userId: 'testUserId'
    }));
    try {
      const bot = await controller.addBot(fakeUser, botPayload)
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException)
      expect(e.response).toBe('Bot with this token already exist')
      expect(e.status).toBe(409)
    }
  })

  it('should get new bot', async () => {
    const getBotMock = jest.spyOn(service, 'getBot').mockImplementation(async () => ({
      ...botPayload,
      id: 'testBotId',
      userId: 'testUserId'
    }));

    const bot = await controller.getBot(fakeUser, { id: 'testBotId' })
    
    expect(getBotMock).toBeCalledWith('testBotId')

    expect(bot).toEqual({
      ...botPayload,
      id: 'testBotId',
      userId: 'testUserId',
    })
  })

  it('should not get new bot when user ID not equal', async () => {
    const getBotMock = jest.spyOn(service, 'getBot').mockImplementation(async () => ({
      ...botPayload,
      id: 'testBotId',
      userId: 'testUserId2'
    }));

    try {
      const bot = await controller.getBot(fakeUser, { id: 'testBotId' })
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException)
      expect(e.response).toBe('Bot is not exist')
      expect(e.status).toBe(401)
    }
  })
});
