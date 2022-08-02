import express from 'express'
import { connect } from 'mongoose'
import cors from 'cors'
import Redis from 'ioredis'
import session from 'express-session'
import CookieParser from 'cookie-parser'
import connectRedis from 'connect-redis'
import routes from '@src/routes'
import endpoints from '@rootDir/endpoints.config'

class App {
  public express: express.Application

  public constructor () {
    this.express = express()

    this.middlewares()
    this.database()
    this.session()
    this.routes()
  }

  private middlewares = (): void => {
    this.express.use(express.json())
    this.express.use(cors(
      {
        origin: endpoints.corsOrigin,
        optionsSuccessStatus: 200,
        methods: 'GET,HEAD,PATCH,POST,DELETE'
      }
    ))
    this.express.use(CookieParser())
  }

  private database = (): void => {
    connect(`mongodb://${endpoints.mongoUsername}:${endpoints.mongoPassword}@${endpoints.mongoHost}:${endpoints.mongoPort}/${endpoints.mongoDB}?authSource=admin`)
      .then(() => {
        console.log(`${endpoints.date} -> MongoDB Conectado!`)
      }).catch((err) => console.log(err))
  }

  private routes = (): void => {
    this.express.use(routes.rootRoute)
    this.express.use('/auth', routes.userRoutes)
    this.express.use('/customer', routes.customerRoutes)
  }

  private session = (): void => {
    const RedisStore = connectRedis(session)
    const redisClient = new Redis({
      port: parseInt(endpoints.redisPort, 10),
      host: endpoints.redisHost,
      username: 'default',
      password: endpoints.redisPassword,
      db: 0
    })
    this.express.use(
      session({
        store: new RedisStore({ client: redisClient }),
        saveUninitialized: true,
        secret: endpoints.redisSecret,
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
