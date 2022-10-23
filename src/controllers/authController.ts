import { Response } from 'express'
import { genSalt, hash, compare } from 'bcrypt'
import fileSystem from 'fs-extra'
import User from '@models/User'
import { UserInterface, UserRequest } from '@interfaces/userInterfaces'
import {
  getGoogleOAuthTokens,
  getGoogleUser,
  saveToken,
  saveUserOnSession,
  downloadAvatarImageFromGoogle
} from '@functions/userFunctions'
import env from '@rootDir/env.config'

class AuthController {
  public async check (req: UserRequest, res: Response) {
    const id = req.verifiedUserID
    try {
      const user = await User.findById(id).select('firstName lastName avatar email -_id')

      if (!user) {
        return res.status(422).json({ error: 'Usuário não encontrado!' })
      }
      const userInteface: UserInterface = {
        email: user.email as string,
        firstName: user.firstName as string,
        lastName: user.lastName as string,
        avatar: user.avatar as string
      }
      saveUserOnSession(userInteface, req.session)

      return res.status(200).json({ message: 'Usuário Verificado!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async create (req: UserRequest, res: Response) {
    const { email, firstName, lastName, password, confirmPassword } = req.body
    const avatar = req.file?.filename
    const AvatarError = req.avatarError
    const userExists = await User.findOne({ email })
    const salt = await genSalt(12)
    function removeImage () {
      fileSystem.remove(`./uploads/${avatar}`)
        .catch(err => console.error(err))
    }
    if (!avatar) {
      return res.status(422).json({ error: 'A Imagem de perfil é obrigatória' })
    }
    if (AvatarError) {
      return res.status(422).json({ error: AvatarError })
    }
    if (!firstName) {
      removeImage()
      return res.status(422).json({ error: 'O Nome é obrigatório' })
    }
    if (!lastName) {
      removeImage()
      return res.status(422).json({ error: 'O Sobrenome é obrigatório' })
    }
    if (!email) {
      removeImage()
      return res.status(422).json({ error: 'O Email é obrigatório' })
    }
    if (userExists) {
      removeImage()
      return res.status(422).json({ error: 'Email já cadastrado!' })
    }

    if (!password) {
      removeImage()
      return res.status(422).json({ error: 'A Senha é obrigatória' })
    }
    if (confirmPassword !== password) {
      removeImage()
      return res.status(422).json({ error: 'As Senhas não conferem' })
    }

    const passwordHash = await hash(password as string, salt)
    const user = new User({
      email,
      firstName,
      lastName,
      avatar,
      password: passwordHash

    })
    try {
      await user.save()

      req.session.destroy(err => err)
      saveToken(user?._id.toString(), res)

      return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async login (req: UserRequest, res: Response) {
    const { email, password } = req.body

    if (!email) {
      return res.status(422).json({ error: 'O email é obrigatório' })
    }
    if (!password) {
      return res.status(422).json({ error: 'A senha é obrigatória' })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(422).json({ error: 'Os dados estão incorretos ou o usuário não está cadastrado!' })
    }

    const checkPassword = await compare(password, user.password as string)
    if (!checkPassword) {
      return res.status(422).json({ error: 'Os dados estão incorretos ou o usuário não está cadastrado!' })
    }
    try {
      req.session.destroy((err) => err)
      saveToken(user?._id.toString(), res)
      return res.status(200).json({ message: 'Autenticação realizada com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async google (req: UserRequest, res: Response) {
    const code = req.query.code as string
    try {
      const googleToken = await getGoogleOAuthTokens(code)
      if (googleToken) {
        const idToken = googleToken.id_token
        const accessToken = googleToken.access_token
        const googleUser = await getGoogleUser(idToken, accessToken)
        if (googleUser) {
          const userExists = await User.findOne({ email: googleUser.email })
          if (userExists) {
            req.session.destroy(err => err)
            saveToken(userExists._id.toString(), res)
          } else {
            const filepath = './uploads/'
            const getImageDownloaded = await downloadAvatarImageFromGoogle(googleUser.picture, filepath)
            const ImageDownloaded = `${getImageDownloaded}`.split('/')
            const user = new User({
              email: googleUser.email,
              firstName: googleUser.given_name,
              lastName: googleUser.family_name,
              avatar: ImageDownloaded[1]
            })
            await user.save()

            req.session.destroy(err => err)
            saveToken(user?._id.toString(), res)
          }
          return res.redirect(env.corsOrigin)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async logout (req: UserRequest, res: Response) {
    try {
      res.clearCookie('Jwt')
      req.session.destroy(err => err)
      return res.status(200).json({ message: 'Logout realizado!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }
}

export default new AuthController()
