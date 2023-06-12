import * as dotenv from 'dotenv'
dotenv.config()

export default {
  mongoUsername: process.env.MONGO_USERNAME as string,
  mongoPassword: encodeURIComponent(process.env.MONGO_PASSWORD as string),
  mongoPort: process.env.MONGO_PORT as string,
  mongoHost: process.env.MONGO_HOST as string,
  mongoDB: process.env.MONGO_DB as string,
  expressSessionSecret: process.env.EXPRESS_SESSION_SECRET as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtSecure: process.env.JWT_SECURE as string,
  corsOrigin: process.env.CORS_ORIGIN as string,
  date: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
  googleClientId: process.env.OAUTH_GOOGLE_CLIENT_ID as string,
  googleClientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET_KEY as string,
  googleRedirectUri: process.env.OAUTH_GOOGLE_REDIRECT_URL as string,
  emailUser: process.env.EMAIL_USER as string,
  emailPass: process.env.EMAIL_PASS as string
}
