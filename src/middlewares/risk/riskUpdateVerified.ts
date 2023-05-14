import { Response, NextFunction } from 'express'
import { RiskRequest } from '@interfaces/riskInterfaces'

export default async function RiskUpdateVerified (req: RiskRequest, res: Response, next: NextFunction) {
  const {
    title,
    description,
    category,
    causes,
    probabilityNegative,
    probabilityPositive,
    impactNegative,
    impactPositive,
    status,
    observations
  } = req.body

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
  if (!probabilityNegative) {
    return res.status(422).json({ error: 'A Probabilidade Negativa é obrigatória' })
  }
  if (!probabilityPositive) {
    return res.status(422).json({ error: 'A Probabilidade Positiva é obrigatória' })
  }
  if (!impactNegative) {
    return res.status(422).json({ error: 'O impacto Negativo é obrigatório' })
  }
  if (!impactPositive) {
    return res.status(422).json({ error: 'O impacto Positivo é obrigatório' })
  }
  if (!status) {
    return res.status(422).json({ error: 'O Status é obrigatório' })
  }
  if (!observations) {
    return res.status(422).json({ error: 'As observações são obrigatórias' })
  }

  next()
}
