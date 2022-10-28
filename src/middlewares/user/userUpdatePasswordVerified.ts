import { NextFunction, Response } from 'express'
import { UserRequest } from '@interfaces/userInterfaces'
import User from '@models/User'
import { compare } from 'bcrypt'

export default async function UserUpdatePasswordVerified (req: UserRequest, res: Response, next: NextFunction) {
  const { password, newPassword, confirmPassword } = req.body
  const id = req.verifiedUserID
  const user = await User.findById(id)

  if (!user) {
    return res.status(422).json({ error: 'Usuario não encontrado!' })
  }

  if (!password && user.password) {
    return res.status(422).json({ error: 'A senha é obrigatória' })
  }

  if (!newPassword) {
    return res.status(422).json({ error: 'A nova senha é obrigatória' })
  }

  if (newPassword !== confirmPassword) {
    return res.status(422).json({ error: 'As Senhas não conferem' })
  }
  if (password) {
    const checkPassword = await compare(password, user.password as string)
    if (!checkPassword) {
      return res.status(422).json({ error: 'Os dados estão incorretos ou o usuário não está cadastrado!' })
    }
  }

  next()
}
