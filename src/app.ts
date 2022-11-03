import express from 'express'
import { connect } from 'mongoose'
import cors from 'cors'
import session from 'express-session'
import CookieParser from 'cookie-parser'
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

  private session () {
    this.express.use(
      session({
        saveUninitialized: true,
        secret: env.expressSessionSecret,
        cookie: {
          sameSite: 'strict',
          httpOnly: true
        },
        resave: true
      })
    )
  }

  private routes () {
    this.express.use(routes.rootRoute)
    this.express.use('/auth', routes.authRoutes)
    this.express.use('/user', routes.userRoutes)
    this.express.use('/customer', routes.customerRoutes)
    this.express.use('/project', routes.projectRoutes)
    this.express.use('/task', routes.taskRoutes)
  }
}

export default new App()
