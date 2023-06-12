import { NextFunction, Response } from 'express'
import { UserRequest } from '@interfaces/userInterfaces'
import User from '@models/User'

export default async function AuthUpdatePasswordVerified (req: UserRequest, res: Response, next: NextFunction) {
  const { email, password, confirmPassword } = req.body

  if (!email) {
    return res.status(422).json({ error: 'O email é obrigatório' })
  }

  const user = await User.find({ email })

  if (!user[0]) {
    return res.status(422).json({ error: 'Usuario não encontrado!' })
  }

  if (!password) {
    return res.status(422).json({ error: 'A nova senha é obrigatória' })
  }

  if (password !== confirmPassword) {
    return res.status(422).json({ error: 'As Senhas não conferem' })
  }

  next()
}
