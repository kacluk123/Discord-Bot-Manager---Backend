export const getAuthorizeUrl = (client_id: string) => (
  `https://discord.com/api/oauth2/authorize?client_id=${client_id}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin%2Ftoken&response_type=code&scope=connections%20guilds%20messages.read`
)