import * as dotenv from 'dotenv'
dotenv.config()

export default {
  mongoUsername: process.env.MONGO_USERNAME ?? '',
  mongoPassword: encodeURIComponent(process.env.MONGO_PASSWORD ?? ''),
  mongoPort: process.env.MONGO_PORT ?? '',
  mongoHost: process.env.MONGO_HOST ?? '',
  mongoDB: process.env.MONGO_DB ?? '',
  redisUsername: process.env.REDIS_USERNAME ?? '',
  redisPassword: process.env.REDIS_PASSWORD ?? '',
  redisSecret: process.env.REDIS_SECRET ?? '',
  redisPort: process.env.REDIS_PORT ?? '',
  redisHost: process.env.REDIS_HOST ?? '',
  jwtSecret: process.env.SECRET ?? '',
  jwtSecure: process.env.SECURE ?? '',
  corsOrigin: process.env.CORS_ORIGIN ?? '',
  date: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) ?? ''
}
