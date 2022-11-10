import { Response, NextFunction } from 'express'
import { RiskRequest } from '@interfaces/riskInterfaces'

export default async function RiskUpdateVerified (req: RiskRequest, res: Response, next: NextFunction) {
  const { title, description, category, causes, probability, impact, observations } = req.body

  if (!title) {
    return res.status(422).json({ error: 'O Título é obrigatório' })
  }
  if (!description) {
    return res.status(422).json({ error: 'A Descrição é obrigatória' })
  }
  if (!category) {
    return res.status(422).json({ error: 'A Categoria é obrigatória' })
  }
  if (!causes) {
    return res.status(422).json({ error: 'As Causas são obrigatórias' })
  }
  if (!probability) {
    return res.status(422).json({ error: 'A Probabilidade é obrigatória' })
  }
  if (!impact) {
    return res.status(422).json({ error: 'O impacto é obrigatório' })
  }
  if (!observations) {
    return res.status(422).json({ error: 'As observações são obrigatórias' })
  }

  next()
}
