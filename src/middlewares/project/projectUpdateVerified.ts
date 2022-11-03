import { Response, NextFunction } from 'express'
import { ProjectRequest } from '@interfaces/projectInterfaces'

export default async function ProjectUpdateVerified (req: ProjectRequest, res: Response, next: NextFunction) {
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
