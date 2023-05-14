import { Response, NextFunction } from 'express'
import { ActionRequest } from '@interfaces/actionInterfaces'

export default async function ActionCreateVerified (req: ActionRequest, res: Response, next: NextFunction) {
  const { title, description, type, responsible, status, cost, observation } = req.body

  if (!title) {
    return res.status(422).json({ error: 'O Título é obrigatório' })
  }
  if (!description) {
    return res.status(422).json({ error: 'A Descrição é obrigatória' })
  }
  if (!type) {
    return res.status(422).json({ error: 'O Tipo é obrigatório' })
  }
  if (!responsible) {
    return res.status(422).json({ error: 'O Resposável é obrigatório' })
  }
  if (!status) {
    return res.status(422).json({ error: 'O Status é obrigatório' })
  }
  if (!cost) {
    return res.status(422).json({ error: 'O Custo é obrigatório' })
  }
  if (!observation) {
    return res.status(422).json({ error: 'A observação é obrigatória' })
  }

  next()
}
