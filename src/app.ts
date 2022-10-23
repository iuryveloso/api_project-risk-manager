import express from 'express'
import { connect } from 'mongoose'
import cors from 'cors'
import Redis from 'ioredis'
import session from 'express-session'
import CookieParser from 'cookie-parser'
import connectRedis from 'connect-redis'
import routes from '@src/routes'
import env from '@rootDir/env.config'

class App {
  public express: express.Application

  public constructor () {
    this.express = express()

    this.middlewares()
    this.database()
    this.session()
    this.routes()
  }

  private middlewares () {
    this.express.use(express.json())
    this.express.use(cors(
      {
        origin: env.corsOrigin,
        optionsSuccessStatus: 200,
        methods: 'GET,HEAD,PATCH,POST,DELETE',
        credentials: true
      }
    ))
    this.express.use(CookieParser())
  }

  private database () {
    connect(`mongodb://${env.mongoUsername}:${env.mongoPassword}@${env.mongoHost}:${env.mongoPort}/${env.mongoDB}?authSource=admin`)
      .then(() => {
        console.log(`${env.date} -> MongoDB Conectado!`)
      }).catch((err) => console.log(err))
  }

  private routes () {
    this.express.use(routes.rootRoute)
    this.express.use('/auth', routes.authRoutes)
    this.express.use('/user', routes.userRoutes)
    this.express.use('/customer', routes.customerRoutes)
    this.express.use('/theme', routes.themeRoutes)
  }

  private session () {
    const RedisStore = connectRedis(session)
    const redisClient = new Redis({
      port: parseInt(env.redisPort, 10),
      host: env.redisHost,
      username: 'default',
      password: env.redisPassword,
      db: 0
    })
    this.express.use(
      session({
        store: new RedisStore({ client: redisClient }),
        saveUninitialized: true,
        secret: env.redisSecret,
        cookie: {
          sameSite: 'strict',
          httpOnly: true
        },
        resave: true
      })
    )
  }
}

export default new App()
