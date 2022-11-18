import { Request, Response } from 'express'
import Risk from '@models/Risk'
import { RiskInterface, RiskRequest } from '@interfaces/riskInterfaces'

class RiskController {
  public async list (req: RiskRequest, res: Response) {
    const projectID = req.params.projectID
    try {
      const risks = await Risk.find({ projectID }).sort({ title: 'asc' }).collation({
        caseLevel: true,
        locale: 'pt'
      })
      return res.status(200).json(risks)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async get (req: RiskRequest, res: Response) {
    const id = req.params.id
    try {
      const risks = await Risk.findById(id)
      return res.status(200).json(risks)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async create (req: RiskRequest, res: Response) {
    const {
      title,
      description,
      category,
      causes,
      probabilityPositive,
      probabilityNegative,
      impactPositive,
      impactNegative,
      observations,
      projectID
    } = req.body

    const risk = new Risk({
      title,
      description,
      category,
      causes,
      probabilityPositive,
      probabilityNegative,
      impactPositive,
      impactNegative,
      observations,
      projectID
    })
    try {
      await Risk.create(risk)
      return res.status(201).json({ message: 'Risco cadastrado com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async update (req: RiskRequest, res: Response) {
    const id = req.params.id
    const {
      title,
      description,
      category,
      causes,
      probabilityPositive,
      probabilityNegative,
      impactPositive,
      impactNegative,
      observations,
      projectID
    } = req.body

    const risk: RiskInterface = {
      title,
      description,
      category,
      causes,
      probabilityPositive,
      probabilityNegative,
      impactPositive,
      impactNegative,
      observations,
      projectID
    }

    try {
      const updatedRisk = await Risk.updateOne({ _id: id }, risk)

      if (updatedRisk.matchedCount === 0) {
        return res.status(422).json({ message: 'Risco não encontrado!' })
      }

      return res.status(201).json({ message: 'Risco atualizado com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async delete (req: Request, res: Response) {
    const id = req.params.id
    try {
      const risk = await Risk.findOne({ _id: id })

      if (!risk) {
        return res.status(422).json({ message: 'Risco não encontrado!' })
      }

      await Risk.deleteOne({ _id: id })

      return res.status(200).json({ message: 'Risco removido com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }
}

export default new RiskController()
