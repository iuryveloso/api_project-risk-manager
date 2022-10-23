import { Response } from 'express'
import { genSalt, hash, compare } from 'bcrypt'
import fileSystem from 'fs-extra'
import { PassThrough, pipeline } from 'stream'
import User from '@models/User'
import { UserInterface, UserRequest } from '@interfaces/userInterfaces'
import {
  getUserOnSession,
  saveUserOnSession
} from '@functions/userFunctions'

class UserController {
  public async get (req: UserRequest, res: Response) {
    try {
      const user = getUserOnSession(req.session)
      if (!user) {
        return res.status(422).json({ error: 'Usuário não encontrado!' })
      }

      return res.status(200).json(user)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async getAvatar (req: UserRequest, res: Response) {
    const id = req.verifiedUserID
    try {
      const user = await User.findById(id).select('avatar -_id')

      if (user?.avatar) {
        const readStream = fileSystem.createReadStream(`./uploads/${user.avatar}`)
        const passThrough = new PassThrough()
        pipeline(readStream, passThrough, (error) => {
          if (error) {
            console.log(error)
            return res.status(422)
          }
        })
        passThrough.pipe(res)
      } else {
        return res.status(422)
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async update (req: UserRequest, res: Response) {
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

    const user: UserInterface = {
      email,
      firstName,
      lastName
    }

    try {
      const updatedUser = await User.updateOne({ _id: id }, user)

      if (updatedUser.matchedCount === 0) {
        return res.status(422).json({ error: 'Usuário não encontrado!' })
      }

      saveUserOnSession(user, req.session)

      return res.status(201).json({ message: 'Usuário atualizado com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async updateAvatar (req: UserRequest, res: Response) {
    const avatar = req.file?.filename
    const AvatarError = req.avatarError
    const id = req.verifiedUserID
    function removeImage (avatarname: string) {
      fileSystem.remove(`./uploads/${avatarname}`)
        .catch(err => console.error(err))
    }

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

    const newUser: UserInterface = { avatar }

    try {
      const updatedUser = await User.updateOne({ _id: id }, newUser)

      if (updatedUser.matchedCount === 0) {
        return res.status(422).json({ error: 'Usuário não encontrado!' })
      }

      saveUserOnSession(newUser, req.session)

      return res.status(201).json({ message: 'Imagem de perfil alterada com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async updatePassword (req: UserRequest, res: Response) {
    const { password, newPassword, confirmPassword } = req.body
    const id = req.verifiedUserID
    const user = await User.findById(id)
    const salt = await genSalt(12)

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

    const passwordHash = await hash(newPassword, salt)

    const userWithNewPassword: UserInterface = {
      password: passwordHash
    }
    try {
      const updatedUser = await User.updateOne({ _id: id }, userWithNewPassword)

      if (updatedUser.matchedCount === 0) {
        return res.status(422).json({ error: 'Usuário não encontrado!' })
      }

      return res.status(201).json({ message: 'Usuário atualizado com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }
}

export default new UserController()
