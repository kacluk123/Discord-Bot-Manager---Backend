import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthenticationGuard } from '../auth/jwt/jwt.guard'
import { User } from '../common/decorators/user'
import { IUser} from '../auth/jwt/jwt.strategy'
import { UsersService } from './users.service'

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}
  
  @UseGuards(JwtAuthenticationGuard)
  @Get('authorize')
  async authorizeUser(@User() user: IUser) {
    const userData = await this.usersService.getDiscordUser(user.discordToken)
    return userData
  }
}
