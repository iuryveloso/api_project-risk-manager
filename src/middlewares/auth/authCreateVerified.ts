import { NextFunction, Response } from 'express'
import { UserRequest } from '@interfaces/userInterfaces'
import User from '@models/User'
import { removeImage } from '@functions/userFunctions'

export default async function authCreateVerified (req: UserRequest, res: Response, next: NextFunction) {
  const { email, firstName, lastName, password, confirmPassword } = req.body
  const avatar = req.file?.filename
  const AvatarError = req.avatarError
  const userExists = await User.findOne({ email })

  if (!avatar) {
    return res.status(422).json({ error: 'A Imagem de perfil é obrigatória' })
  }
  if (AvatarError) {
    return res.status(422).json({ error: AvatarError })
  }
  if (!firstName) {
    removeImage(avatar)
    return res.status(422).json({ error: 'O Nome é obrigatório' })
  }
  if (!lastName) {
    removeImage(avatar)
    return res.status(422).json({ error: 'O Sobrenome é obrigatório' })
  }
  if (!email) {
    removeImage(avatar)
    return res.status(422).json({ error: 'O Email é obrigatório' })
  }
  if (userExists) {
    removeImage(avatar)
    return res.status(422).json({ error: 'Email já cadastrado!' })
  }

  if (!password) {
    removeImage(avatar)
    return res.status(422).json({ error: 'A Senha é obrigatória' })
  }
  if (confirmPassword !== password) {
    removeImage(avatar)
    return res.status(422).json({ error: 'As Senhas não conferem' })
  }
  next()
}
