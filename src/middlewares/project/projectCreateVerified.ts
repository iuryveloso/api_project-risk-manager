import { Response, NextFunction } from 'express'
import { ProjectRequest } from '@interfaces/projectInterfaces'

export default async function ProjectCreateVerified (req: ProjectRequest, res: Response, next: NextFunction) {
  const { begin, description, end, title, occupationArea } = req.body

  if (!title) {
    return res.status(422).json({ error: 'O Título é obrigatório' })
  }
  if (!description) {
    return res.status(422).json({ error: 'A Descrição é obrigatória' })
  }
  if (!occupationArea) {
    return res.status(422).json({ error: 'A Área de Atuação é obrigatória' })
  }
  if (!begin) {
    return res.status(422).json({ error: 'A Data de Início é obrigatória' })
  }
  if (!end) {
    return res.status(422).json({ error: 'A Data de Término é obrigatória' })
  }

  if (begin > end) {
    return res.status(422).json({ error: 'A Data de Início tem que ser anterior ou igual à data de Término' })
  }

  next()
}
