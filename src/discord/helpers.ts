export const getAuthorizeUrl = (client_id: string) => (
  `https://discord.com/api/oauth2/authorize?client_id=${client_id}&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fdashboard&response_type=code&scope=identify%20guilds%20email%20messages.read`
)

