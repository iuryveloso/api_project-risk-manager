import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import endpoints from '@rootDir/endpoints.config'
import routes from '@src/routes'

class App {
  public express: express.Application
  public date: String

  public constructor () {
    this.express = express()
    this.date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })

    this.middlewares()
    this.database()
    this.routes()
  }

  private middlewares = (): void => {
    this.express.use(express.json())
    this.express.use(cors())
  }

  private database = ():void => {
    mongoose.connect(`mongodb://${endpoints.username}:${endpoints.password}@mongo_project-manager:27017/project_manager?authSource=admin`)
      .then(() => {
        console.log(`${this.date} -> MongoDB Conectado!`)
      }).catch((err) => console.log(err))
  }

  private routes = ():void => {
    this.express.use(routes)
  }
}

export default new App()
