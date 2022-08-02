import { Request, Response } from 'express'
import { sign } from 'jsonwebtoken'
import { genSalt, hash, compare } from 'bcrypt'
import { Session } from 'express-session'
import User from '@models/User'
import endpoints from '@rootDir/endpoints.config'

interface UserInterface {
  email: string
  firstName: string
  lastName: string
  avatar: string
  password?: string
  confirmPassword?: string
}

interface SessionUserInterface extends Session {
  email?: string
  firstName?: string
  lastName?: string
  avatar?: string
}

interface UserRequest extends Request {
  body: UserInterface
  verifiedUserID?: string
  session: SessionUserInterface
}

class UserController {
  public get = async (req: UserRequest, res: Response) => {
    const id = req.verifiedUserID
    try {
      const user = await User.findById(id).select('firstName lastName avatar email -_id')

      if (!user) {
        return res.status(422).json({ message: 'Usuário não encontrado!' })
      }

      return res.status(200).json({ message: 'Usuário Encontrado!', user })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public check = async (req: UserRequest, res: Response) => {
    const id = req.verifiedUserID
    try {
      const user = await User.findById(id).select('firstName lastName avatar email -_id')

      if (!user) {
        return res.status(422).json({ message: 'Usuário não encontrado!' })
      }
      const userInteface: UserInterface = {
        email: user.email ?? '',
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        avatar: user.avatar ?? ''
      }
      this.saveUserOnSession(userInteface, req.session)

      return res.status(200).json({ message: 'Usuário Verificado!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public create = async (req: UserRequest, res: Response) => {
    const { email, firstName, lastName, avatar, password, confirmPassword } = req.body
    const userExists = await User.findOne({ email })
    const salt = await genSalt(12)
    if (!firstName) {
      return res.status(422).json({ error: 'O Nome é obrigatório' })
    }
    if (!lastName) {
      return res.status(422).json({ error: 'O Sobrenome é obrigatório' })
    }
    if (!email) {
      return res.status(422).json({ error: 'O Email é obrigatório' })
    }
    if (!password) {
      return res.status(422).json({ error: 'A Senha é obrigatória' })
    }
    if (confirmPassword !== password) {
      return res.status(422).json({ error: 'As Senhas não conferem' })
    }

    if (userExists) {
      return res.status(422).json({ error: 'Email já cadastrado!' })
    }

    const passwordHash = await hash(password ?? '', salt)
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
      this.saveToken(user?._id.toString(), res)

      return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public login = async (req: UserRequest, res: Response) => {
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

    const checkPassword = await compare(password, user.password ?? '')
    if (!checkPassword) {
      return res.status(422).json({ error: 'Os dados estão incorretos ou o usuário não está cadastrado!' })
    }

    try {
      req.session.destroy((err) => err)
      this.saveToken(user?._id.toString(), res)

      return res.status(200).json({ message: 'Autenticação realizada com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public update = async (req: UserRequest, res: Response) => {
    const { email, firstName, lastName, avatar } = req.body
    const id = req.verifiedUserID

    const emailExists = await User.findOne({ email })
    const emailExistsId = emailExists?._id.toString()
    if (emailExists && emailExistsId !== id) {
      return res.status(422).json({ error: 'O email cadastrado já existe!' })
    }

    const user: UserInterface = {
      email,
      firstName,
      lastName,
      avatar
    }

    try {
      const updatedUser = await User.updateOne({ _id: id }, user)

      if (updatedUser.matchedCount === 0) {
        return res.status(422).json({ message: 'Usuário não encontrado!' })
      }

      this.saveUserOnSession(user, req.session)

      return res.status(201).json({ message: 'Usuário atualizado com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public logout = (req: Request, res: Response) => {
    try {
      res.clearCookie('Jwt')
      req.session.destroy(err => err)
      return res.status(200).json({ message: 'Logout realizado!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  private createToken = (userID: string) => {
    const secret = endpoints.jwtSecret
    const token = sign({ userID }, secret)
    return token
  }

  private saveToken = (userID: string, res: Response) => {
    const token = this.createToken(userID)
    res.cookie('Jwt', token, {
      httpOnly: true,
      secure: endpoints.jwtSecure !== 'development',
      sameSite: 'strict',
      path: '/'
    })
  }

  private saveUserOnSession = (user: UserInterface, sessionUser: SessionUserInterface) => {
    sessionUser.firstName = user.firstName
    sessionUser.lastName = user.lastName
    sessionUser.avatar = user.avatar
    sessionUser.email = user.email
  }
}

export default new UserController()
