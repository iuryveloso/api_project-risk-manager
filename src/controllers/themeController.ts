import { Response } from 'express'
import { ThemeRequest } from '@interfaces/themeInterfaces'

class ThemeController {
  public get (req: ThemeRequest, res: Response) {
    const theme = req.session.theme
    if (!theme) {
      return res.status(200).json({ theme: 'dark' })
    }

    return res.status(200).json({ theme })
  }

  public set (req: ThemeRequest, res: Response) {
    const { theme } = req.body

    if (!theme) {
      return res.status(422).json({ error: 'O Tema é obrigatório' })
    }

    req.session.theme = theme
    return res.status(201).json({ message: 'Tema registrado com sucesso!' })
  }
}

export default new ThemeController()
