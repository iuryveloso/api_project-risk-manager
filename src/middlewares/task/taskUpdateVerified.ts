import { Response, NextFunction } from 'express'
import { TaskRequest } from '@interfaces/taskInterfaces'

export default async function TaskUpdateVerified (req: TaskRequest, res: Response, next: NextFunction) {
  const { begin, description, end, title } = req.body

  if (!title) {
    return res.status(422).json({ error: 'O Título é obrigatório' })
  }
  if (!description) {
    return res.status(422).json({ error: 'A Descrição é obrigatória' })
  }
  if (!begin) {
    return res.status(422).json({ error: 'A Data de Início é obrigatória' })
  }
  if (!end) {
    return res.status(422).json({ error: 'A Data de Término é obrigatória' })
  }

  next()
}
