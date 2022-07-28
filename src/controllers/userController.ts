import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '@models/User'
import endpoints from '@rootDir/endpoints.config'

interface UserInterface {
  email?: string
  firstName?: string
  lastName?: string
  avatar?: string
  password?: string
  confirmPassword?: string
}

interface UserRequest extends Request {
  body: UserInterface
  verifiedUserID?: string
}

class UserController {
  public get = async (req: UserRequest, res: Response) => {
    const id = req.verifiedUserID
    try {
      const user = await User.findById(id).select('firstName lastName avatar email -_id')

      if (!user) {
        return res.status(422).json({ message: 'Usuário não encontrado!' })
      }

      res.status(200).json(user)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public create = async (req: UserRequest, res: Response) => {
    const { email, firstName, lastName, avatar, password, confirmPassword } = req.body
    const userExists = await User.findOne({ email })
    const salt = await bcrypt.genSalt(12)

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

    const passwordHash = await bcrypt.hash(password ?? '', salt)
    const user = new User({
      email,
      firstName,
      lastName,
      avatar,
      password: passwordHash
    })

    try {
      await user.save()
      return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public login = async (req: Request, res: Response) => {
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

    const checkPassword = await bcrypt.compare(password, user.password ?? '')
    if (!checkPassword) {
      return res.status(422).json({ error: 'Os dados estão incorretos ou o usuário não está cadastrado!' })
    }

    try {
      const secret = endpoints.secret
      const id = user?._id
      const token = jwt.sign({ id }, secret)

      res.status(201).json({ message: 'Autenticação realizada com sucesso!', token })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public update = async (req: UserRequest, res: Response) => {
    const { email, firstName, lastName, avatar } = req.body
    const id = req.verifiedUserID

    const emailExists = await User.findOne({ email })
    if (emailExists) {
      return res.status(422).json({ error: 'O email cadastrado já existe!' })
    }

    const user = {
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

      res.status(201).json({ message: 'Usuário atualizado com sucesso!' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }
}

export default new UserController()
