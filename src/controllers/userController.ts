import { Response } from 'express'
import { genSalt, hash } from 'bcrypt'
import fileSystem from 'fs-extra'
import { PassThrough, pipeline } from 'stream'
import User from '@models/User'
import { UserInterface, UserRequest } from '@interfaces/userInterfaces'

class UserController {
  public async get (req: UserRequest, res: Response) {
    const id = req.verifiedUserID
    try {
      const user = await User.findById(id).select('firstName lastName avatar email occupation company')
      if (!user) {
        return res.status(422).json({ error: 'Usuário não encontrado!' })
      }

      return res.status(200).json(user)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async list (req: UserRequest, res: Response) {
    try {
      const user = await User.find().select('firstName lastName avatar email occupation company')
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

  public async getAvatarByAvatarName (req: UserRequest, res: Response) {
    const avatarName = req.params.avatarName
    try {
      const readStream = fileSystem.createReadStream(`./uploads/${avatarName}`)
      const passThrough = new PassThrough()
      pipeline(readStream, passThrough, (error) => {
        if (error) {
          console.log(error)
          return res.status(422)
        }
      })
      passThrough.pipe(res)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async update (req: UserRequest, res: Response) {
    const { email, firstName, lastName, company, occupation } = req.body
    const id = req.verifiedUserID

    const user: UserInterface = {
      email,
      firstName,
      lastName,
      company,
      occupation
    }

    try {
      const updatedUser = await User.updateOne({ _id: id }, user)

      if (updatedUser.matchedCount === 0) {
        return res.status(422).json({ error: 'Usuário não encontrado!' })
      }

      return res.status(201).json({ message: 'Usuário atualizado com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async updateAvatar (req: UserRequest, res: Response) {
    const avatar = req.file?.filename
    const id = req.verifiedUserID

    const newUser: UserInterface = { avatar }

    try {
      const updatedUser = await User.updateOne({ _id: id }, newUser)

      if (updatedUser.matchedCount === 0) {
        return res.status(422).json({ error: 'Usuário não encontrado!' })
      }

      return res.status(201).json({ message: 'Imagem de perfil alterada com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async updatePassword (req: UserRequest, res: Response) {
    const { newPassword } = req.body
    const id = req.verifiedUserID
    const salt = await genSalt(12)

    const passwordHash = await hash(newPassword as string, salt)

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
