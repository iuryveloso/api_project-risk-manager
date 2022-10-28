import { NextFunction, Response } from 'express'
import { UserRequest } from '@interfaces/userInterfaces'
import User from '@models/User'

export default async function UserUpdateVerified (req: UserRequest, res: Response, next: NextFunction) {
  const { email, firstName, lastName } = req.body
  const id = req.verifiedUserID
  if (!email) {
    return res.status(422).json({ error: 'O Email é obrigatório' })
  }
  if (!firstName) {
    return res.status(422).json({ error: 'O Nome é obrigatório' })
  }
  if (!lastName) {
    return res.status(422).json({ error: 'O Sobrenome é obrigatório' })
  }
  const emailAlreadyExists = await User.findOne({ email })
  const emailAlreadyExistsId = emailAlreadyExists?._id.toString()
  if (emailAlreadyExists && emailAlreadyExistsId !== id) {
    return res.status(422).json({ error: 'O email cadastrado já existe!' })
  }

  next()
}
