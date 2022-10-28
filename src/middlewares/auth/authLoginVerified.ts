import { NextFunction, Response } from 'express'
import { compare } from 'bcrypt'
import { UserRequest } from '@interfaces/userInterfaces'
import User from '@models/User'

export default async function authLoginVerified (req: UserRequest, res: Response, next: NextFunction) {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!email) {
    return res.status(422).json({ error: 'O email é obrigatório' })
  }
  if (!password) {
    return res.status(422).json({ error: 'A senha é obrigatória' })
  }

  if (!user) {
    return res.status(422).json({ error: 'Os dados estão incorretos ou o usuário não está cadastrado!' })
  }

  const checkPassword = await compare(password, user.password as string)
  if (!checkPassword) {
    return res.status(422).json({ error: 'Os dados estão incorretos ou o usuário não está cadastrado!' })
  }
  req.verifiedUserID = user?._id.toString()
  next()
}
