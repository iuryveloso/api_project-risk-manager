import { Request, Response } from 'express'
import { genSalt, hash, compare } from 'bcrypt'
import User from '@models/User'
import { UserInterface, UserRequest } from '@interfaces/userInterfaces'
import { getUserOnSession, saveToken, saveUserOnSession } from '@functions/userFunctions'

class UserController {
  public async get (req: UserRequest, res: Response) {
    try {
      const user = getUserOnSession(req.session)

      if (!user) {
        return res.status(422).json({ message: 'Usuário não encontrado!' })
      }

      return res.status(200).json(user)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async check (req: UserRequest, res: Response) {
    const id = req.verifiedUserID
    try {
      const user = await User.findById(id).select('firstName lastName avatar email -_id')

      if (!user) {
        return res.status(422).json({ message: 'Usuário não encontrado!' })
      }
      const userInteface: UserInterface = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar
      }
      saveUserOnSession(userInteface, req.session)

      return res.status(200).json({ message: 'Usuário Verificado!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async create (req: UserRequest, res: Response) {
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
    if (!avatar) {
      return res.status(422).json({ error: 'O Avatar é obrigatório' })
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

    const passwordHash = await hash(password, salt)
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

  public async logout (req: Request, res: Response) {
    try {
      res.clearCookie('Jwt')
      req.session.destroy(err => err)
      return res.status(200).json({ message: 'Logout realizado!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async update (req: UserRequest, res: Response) {
    const { email, firstName, lastName, avatar } = req.body
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
    if (!avatar) {
      return res.status(422).json({ error: 'O Avatar é obrigatório' })
    }
    const emailAlreadyExists = await User.findOne({ email })
    const emailAlreadyExistsId = emailAlreadyExists?._id.toString()
    if (emailAlreadyExists && emailAlreadyExistsId !== id) {
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

      saveUserOnSession(user, req.session)

      return res.status(201).json({ message: 'Usuário atualizado com sucesso!' })
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

    if (!password) {
      return res.status(422).json({ error: 'A senha é obrigatória' })
    }

    if (!newPassword) {
      return res.status(422).json({ error: 'A nova senha é obrigatória' })
    }

    if (newPassword !== confirmPassword) {
      return res.status(422).json({ error: 'As Senhas não conferem' })
    }

    const checkPassword = await compare(password, user.password as string)
    if (!checkPassword) {
      return res.status(422).json({ error: 'Os dados estão incorretos ou o usuário não está cadastrado!' })
    }

    const passwordHash = await hash(newPassword, salt)

    const userWithNewPassword: UserInterface = {
      password: passwordHash
    }
    try {
      const updatedUser = await User.updateOne({ _id: id }, userWithNewPassword)

      if (updatedUser.matchedCount === 0) {
        return res.status(422).json({ message: 'Usuário não encontrado!' })
      }

      return res.status(201).json({ message: 'Usuário atualizado com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }
}

export default new UserController()
