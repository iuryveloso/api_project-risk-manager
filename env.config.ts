import * as dotenv from 'dotenv'
dotenv.config()

export default {
  mongoUsername: process.env.MONGO_USERNAME as string,
  mongoPassword: encodeURIComponent(process.env.MONGO_PASSWORD as string),
  mongoPort: process.env.MONGO_PORT as string,
  mongoHost: process.env.MONGO_HOST as string,
  mongoDB: process.env.MONGO_DB as string,
  redisUsername: process.env.REDIS_USERNAME as string,
  redisPassword: process.env.REDIS_PASSWORD as string,
  redisSecret: process.env.REDIS_SECRET as string,
  redisPort: process.env.REDIS_PORT as string,
  redisHost: process.env.REDIS_HOST as string,
  jwtSecret: process.env.SECRET as string,
  jwtSecure: process.env.SECURE as string,
  corsOrigin: process.env.CORS_ORIGIN as string,
  date: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
  googleClientId: process.env.OAUTH_GOOGLE_CLIENT_ID as string,
  googleClientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET_KEY as string,
  googleRedirectUri: process.env.OAUTH_GOOGLE_REDIRECT_URL as string
}
