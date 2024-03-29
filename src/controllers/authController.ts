import { Request, Response } from 'express'
import { genSalt, hash } from 'bcrypt'
import { createTransport } from 'nodemailer'
import User from '@models/User'
import { UserInterface, UserRequest } from '@interfaces/userInterfaces'
import {
  getGoogleOAuthTokens,
  getGoogleUser,
  saveToken,
  downloadAvatarImageFromGoogle
} from '@functions/userFunctions'
import env from '@src/env.config'

interface EmailRequest extends Request {
  body: {receiver: string, token: string}
}

class AuthController {
  public async check (req: UserRequest, res: Response) {
    const id = req.verifiedUserID
    try {
      const user = await User.findById(id).select('firstName lastName avatar email -_id')

      if (!user) {
        return res.status(422).json({ error: 'Usuário não encontrado!' })
      }

      return res.status(200).json({ message: 'Usuário Verificado!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async create (req: UserRequest, res: Response) {
    const { email, firstName, lastName, password } = req.body
    const avatar = req.file?.filename
    const salt = await genSalt(12)

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
    try {
      saveToken(req.verifiedUserID as string, res)
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

  public async sendEmail (req: EmailRequest, res: Response) {
    const { receiver, token } = req.body
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: env.emailUser,
        pass: env.emailPass
      }
    })
    transporter.sendMail({
      from: 'Gerencidor de Riscos de Projetos <gerenciador.riscos@gmail.com>',
      to: receiver,
      subject: 'Recuperar Senha',
      html: `<p>Seu token de recuperação de senha é: <strong>${token}</strong></p>`
    })
      .then((resp) => {
        console.log('Email enviado!')
        return res.status(200).json({ message: resp })
      })
      .catch((err) => {
        console.log(err)
        return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
      })
  }

  public async updatePassword (req: UserRequest, res: Response) {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    const salt = await genSalt(12)

    const passwordHash = await hash(password as string, salt)

    const userWithNewPassword: UserInterface = {
      password: passwordHash
    }
    try {
      const updatedUser = await User.updateOne({ _id: user?._id }, userWithNewPassword)

      if (updatedUser.matchedCount === 0) {
        return res.status(422).json({ error: 'Usuário não encontrado!' })
      }

      saveToken(user?._id.toString() as string, res)

      return res.status(201).json({ message: 'Usuário atualizado com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async logout (req: UserRequest, res: Response) {
    try {
      res.clearCookie('Jwt')
      return res.status(200).json({ message: 'Logout realizado!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }
}

export default new AuthController()
