import { Request, Response } from 'express'
import Action from '@models/Action'
import { ActionInterface, ActionRequest } from '@interfaces/actionInterfaces'

class ActionController {
  public async list (req: Request, res: Response) {
    const riskID = req.params.riskID
    try {
      const actions = await Action.find({ riskID }).sort({ firstName: 'asc' }).collation({
        caseLevel: true,
        locale: 'pt'
      })
      return res.status(200).json(actions)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async listAll (req: Request, res: Response) {
    try {
      const actions = await Action.find().sort({ firstName: 'asc' }).collation({
        caseLevel: true,
        locale: 'pt'
      })
      return res.status(200).json(actions)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async get (req: Request, res: Response) {
    const id = req.params.id
    try {
      const action = await Action.findById(id)
      return res.status(200).json(action)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async create (req: ActionRequest, res: Response) {
    const { title, description, type, responsible, status, cost, observation, riskID } = req.body

    const action = new Action({
      title,
      description,
      type,
      responsible,
      status,
      cost,
      observation,
      riskID
    })

    try {
      await Action.create(action)
      return res.status(201).json({ message: 'Cliente cadastrado com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async update (req: ActionRequest, res: Response) {
    const id = req.params.id
    const { title, description, type, responsible, status, cost, observation, riskID } = req.body

    const action: ActionInterface = {
      title,
      description,
      type,
      responsible,
      status,
      cost,
      observation,
      riskID
    }

    try {
      const updatedAction = await Action.updateOne({ _id: id }, action)

      if (updatedAction.matchedCount === 0) {
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
      const action = await Action.findOne({ _id: id })

      if (!action) {
        return res.status(422).json({ message: 'Cliente não encontrado!' })
      }

      await Action.deleteOne({ _id: id })

      return res.status(200).json({ message: 'Cliente removido com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }
}

export default new ActionController()
