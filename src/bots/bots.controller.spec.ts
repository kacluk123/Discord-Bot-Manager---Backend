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

const USER_ID = 'testUserId'
const BOT_ID = 'testBotId'

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
      userId: USER_ID,
      id: BOT_ID,
    }));

    const mewBot = await controller.addBot(fakeUser, botPayload)

    expect(addBotMock).toBeCalledWith({
      userId: USER_ID,
      ...botPayload
    })

    expect(mewBot).toEqual({
      ...botPayload,
      id: BOT_ID,
      userId: USER_ID,
    })
  })

  it('should not create new bot', async () => {
    jest.spyOn(service, 'checkThatKeyExist').mockImplementation(async () => true);
    jest.spyOn(service, 'addBot').mockImplementation(async () => ({
      ...botPayload,
      id: BOT_ID,
      userId: USER_ID
    }));
    try {
      const bot = await controller.addBot(fakeUser, botPayload)
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException)
      expect(e.response).toBe('Bot with this token already exist')
      expect(e.status).toBe(409)
    }
  })

  it('should get bot', async () => {
    const getBotMock = jest.spyOn(service, 'getBot').mockImplementation(async () => ({
      ...botPayload,
      id: BOT_ID,
      userId: USER_ID
    }));

    const bot = await controller.getBot(fakeUser, { id: BOT_ID })
    
    expect(getBotMock).toBeCalledWith(BOT_ID)

    expect(bot).toEqual({
      ...botPayload,
      id: BOT_ID,
      userId: USER_ID,
    })
  })

  it('should not get bot when user ID not equal', async () => {
    const getBotMock = jest.spyOn(service, 'getBot').mockImplementation(async () => ({
      ...botPayload,
      id: BOT_ID,
      userId: USER_ID
    }));

    try {
      const bot = await controller.getBot(fakeUser, { id: BOT_ID })
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException)
      expect(e.response).toBe('Bot is not exist')
      expect(e.status).toBe(401)
    }
  })

  it('should return bots list', async () => {
    const getBotsMock = jest.spyOn(service, 'getBots').mockImplementation(async () => ([{
      ...botPayload,
      id: BOT_ID,
      userId: USER_ID
    }]));
    
    const bots = await controller.getBots(fakeUser)

    expect(getBotsMock).toBeCalledWith(USER_ID)
    expect(bots).toEqual([{
      ...botPayload,
      id: BOT_ID,
      userId: USER_ID,
    }])
  })

  it('should delete bot', async () => {
    const deleteBotMock = jest.spyOn(service, 'deleteBot').mockImplementation(async () => ({
      message: `Bot with ID: ${BOT_ID} has been deleted`
    }));
    const getBotMock = jest.spyOn(service, 'getBot').mockImplementation(async () => ({
      ...botPayload,
      id: BOT_ID,
      userId: USER_ID
    }));

    const deleteBot = await controller.deleteBot(fakeUser, { id: BOT_ID })

    expect(deleteBotMock).toBeCalledWith(BOT_ID)
    expect(deleteBot).toEqual({
      message: `Bot with ID: ${BOT_ID} has been deleted`
    })
  })

  it('should not delete bot', async () => {
    const getBotMock = jest.spyOn(service, 'getBot').mockImplementation(async () => undefined);

    try {
      const deleteBot = await controller.deleteBot(fakeUser, { id: BOT_ID })
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException)
      expect(e.response).toBe('Bot is not exist')
      expect(e.status).toBe(401)
    }
  })

  it('should edit bot', async () => {
    const editBotMock = jest.spyOn(service, 'editBot').mockImplementation(async () => ({
      ...botPayload,
      id: BOT_ID,
      userId: USER_ID
    }));

    const getBotMock = jest.spyOn(service, 'getBot').mockImplementation(async () => ({
      ...botPayload,
      id: BOT_ID,
      userId: USER_ID
    }));

    const editedBot = await controller.editBot(fakeUser, { id: BOT_ID }, botPayload)

    expect(editBotMock).toBeCalledWith(botPayload, {
      ...botPayload,
      id: BOT_ID,
      userId: USER_ID
    })
    expect(editedBot).toEqual({
      ...botPayload,
      id: BOT_ID,
      userId: USER_ID,
    })
  })

  it('should not edit bot', async () => {
    const getBotMock = jest.spyOn(service, 'getBot').mockImplementation(async () => undefined);

    try {
      const editedBot = await controller.editBot(fakeUser, { id: BOT_ID }, botPayload)
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException)
      expect(e.response).toBe('Bot is not exist')
      expect(e.status).toBe(401)
    }
  })
});
