import { configService } from "src/config/config.service";

export const getAuthorizeUrl = (client_id: string) => (
  `https://discord.com/api/oauth2/authorize?client_id=${client_id}&${configService.getValue('REDIRECT_URL')}&response_type=code&scope=identify%20guilds%20email`
)
