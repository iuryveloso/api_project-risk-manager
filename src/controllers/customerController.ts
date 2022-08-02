import { Request, Response } from 'express'
import Customer from '@models/Customer'

interface CustomerInterface {
    email: string
    firstName: string
    lastName: string
    address: string
    phone: string
    birthDate: Date
}

interface CustomerRequest extends Request {
    body: CustomerInterface
}

class CustomerController {
  public index = async (req: Request, res: Response) => {
    try {
      const customers = await Customer.find()
      res.status(200).json(customers)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public get = async (req: Request, res: Response) => {
    const id = req.params.id
    try {
      const customer = await Customer.findOne({ _id: id })

      if (!customer) {
        res.status(422).json({ message: 'Cliente não encontrado!' })
        return
      }
      res.status(200).json(customer)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public create = async (req: CustomerRequest, res: Response) => {
    const { email, firstName, lastName, address, phone, birthDate } = req.body

    if (!email) {
      res.status(422).json({ error: 'O Email é obrigatório' })
      return
    }
    if (!firstName) {
      res.status(422).json({ error: 'O Nome é obrigatório' })
      return
    }
    if (!lastName) {
      res.status(422).json({ error: 'O Sobrenome é obrigatório' })
      return
    }
    if (!address) {
      res.status(422).json({ error: 'O Endereço é obrigatório' })
      return
    }
    if (!phone) {
      res.status(422).json({ error: 'O Telefone é obrigatório' })
      return
    }
    if (!birthDate) {
      res.status(422).json({ error: 'a Data de Nascimento é obrigatório' })
      return
    }

    const customer = new Customer({
      email,
      firstName,
      lastName,
      address,
      phone,
      birthDate
    })

    try {
      await Customer.create(customer)
      res.status(201).json({ message: 'Cliente cadastrado com sucesso!' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public update = async (req: CustomerRequest, res: Response) => {
    const id = req.params.id
    const { email, firstName, lastName, address, phone, birthDate } = req.body

    if (!email) {
      res.status(422).json({ error: 'O Email é obrigatório' })
      return
    }
    if (!firstName) {
      res.status(422).json({ error: 'O Nome é obrigatório' })
      return
    }
    if (!lastName) {
      res.status(422).json({ error: 'O Sobrenome é obrigatório' })
      return
    }
    if (!address) {
      res.status(422).json({ error: 'O Endereço é obrigatório' })
      return
    }
    if (!phone) {
      res.status(422).json({ error: 'O Telefone é obrigatório' })
      return
    }
    if (!birthDate) {
      res.status(422).json({ error: 'a Data de Nascimento é obrigatório' })
      return
    }

    const customer: CustomerInterface = {
      email,
      firstName,
      lastName,
      address,
      phone,
      birthDate
    }

    try {
      const updatedCustomer = await Customer.updateOne({ _id: id }, customer)

      if (updatedCustomer.matchedCount === 0) {
        return res.status(422).json({ message: 'Cliente não encontrado!' })
      }

      res.status(201).json({ message: 'Cliente atualizado com sucesso!' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public delete = async (req: Request, res: Response) => {
    const id = req.params.id
    try {
      const customer = await Customer.findOne({ _id: id })

      if (!customer) {
        return res.status(422).json({ message: 'Cliente não encontrado!' })
      }

      await Customer.deleteOne({ _id: id })

      res.status(200).json({ message: 'Cliente removido com sucesso!' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }
}

export default new CustomerController()
