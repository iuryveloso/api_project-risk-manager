import { NextFunction, Response } from 'express'
import { UserRequest } from '@interfaces/userInterfaces'
import User from '@models/User'
import { removeImage } from '@functions/userFunctions'

export default async function UserUpdateAvatarVerified (req: UserRequest, res: Response, next: NextFunction) {
  const avatar = req.file?.filename
  const AvatarError = req.avatarError
  const id = req.verifiedUserID

  if (!avatar) {
    return res.status(422).json({ error: 'A Imagem de perfil é obrigatória' })
  }
  if (AvatarError) {
    return res.status(422).json({ error: AvatarError })
  }

  const user = await User.findById(id)
  if (user?.avatar) {
    removeImage(user?.avatar)
  }

  next()
}
