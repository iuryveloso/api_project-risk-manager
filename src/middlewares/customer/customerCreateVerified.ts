import { Response, NextFunction } from 'express'
import { CustomerRequest } from '@interfaces/customerInterfaces'

export default async function CustomerCreateVerified (req: CustomerRequest, res: Response, next: NextFunction) {
  const { email, firstName, lastName, address, phone, birthDate } = req.body

  if (!email) {
    return res.status(422).json({ error: 'O Email é obrigatório' })
  }
  if (!firstName) {
    return res.status(422).json({ error: 'O Nome é obrigatório' })
  }
  if (!lastName) {
    return res.status(422).json({ error: 'O Sobrenome é obrigatório' })
  }
  if (!address) {
    return res.status(422).json({ error: 'O Endereço é obrigatório' })
  }
  if (!phone) {
    return res.status(422).json({ error: 'O Telefone é obrigatório' })
  }
  if (!birthDate) {
    return res.status(422).json({ error: 'a Data de Nascimento é obrigatório' })
  }

  next()
}
