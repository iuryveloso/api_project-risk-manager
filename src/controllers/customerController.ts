import { Request, Response } from 'express'
import Customer from '@models/Customer'
import { CustomerInterface, CustomerRequest } from '@interfaces/customerInterfaces'

class CustomerController {
  public async index (req: Request, res: Response) {
    try {
      const customers = await Customer.find().sort({ firstName: 'asc' }).collation({
        caseLevel: true,
        locale: 'pt'
      })
      return res.status(200).json(customers)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async get (req: Request, res: Response) {
    const id = req.params.id
    try {
      const customer = await Customer.findOne({ _id: id })

      if (!customer) {
        return res.status(422).json({ message: 'Cliente não encontrado!' })
      }

      return res.status(200).json(customer)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async create (req: CustomerRequest, res: Response) {
    const { email, firstName, lastName, address, phone, birthDate } = req.body

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
      return res.status(201).json({ message: 'Cliente cadastrado com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async update (req: CustomerRequest, res: Response) {
    const id = req.params.id
    const { email, firstName, lastName, address, phone, birthDate } = req.body

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

      return res.status(201).json({ message: 'Cliente atualizado com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async delete (req: Request, res: Response) {
    const id = req.params.id
    try {
      const customer = await Customer.findOne({ _id: id })

      if (!customer) {
        return res.status(422).json({ message: 'Cliente não encontrado!' })
      }

      await Customer.deleteOne({ _id: id })

      return res.status(200).json({ message: 'Cliente removido com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }
}

export default new CustomerController()
