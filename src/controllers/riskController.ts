import { Request, Response } from 'express'
import Risk from '@models/Risk'
import { RiskInterface, RiskRequest } from '@interfaces/riskInterfaces'
import Action from '@models/Action'

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

  public async listHigherImpacts (req: RiskRequest, res: Response) {
    const projectID = req.params.projectID
    try {
      const risks = await Risk.find({ projectID })
      const higherNegativeImpact = risks.sort((a, b) => (b.impactNegative as number) - (a.impactNegative as number))[0].impactNegative as number
      const higherPositiveImpact = risks.sort((a, b) => (b.impactPositive as number) - (a.impactPositive as number))[0].impactPositive as number
      return res.status(200).json({ negative: higherNegativeImpact, positive: higherPositiveImpact })
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

  public async getRisksCost (req: RiskRequest, res: Response) {
    const projectID = req.params.projectID
    try {
      const reduced = async () => {
        const risks = await Risk.find({ projectID, status: 'Aprovado' })
        function expectedValue (cost: number, probability: number) {
          return cost * probability / 100
        }
        let acc = 0
        for (const risk of risks) {
          const actionCosts = (await Action.find({ riskID: risk._id.toString() })).reduce((acc, curr) => acc + (curr.cost as number), 0)
          acc += expectedValue(
            risk.impactNegative as number, risk.probabilityNegative as number
          ) - expectedValue(
            risk.impactPositive as number, risk.probabilityPositive as number
          ) + actionCosts
        }
        return acc
      }

      return res.status(200).json({ risksCost: await reduced() })
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
      status,
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
      status,
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
      status,
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
      status,
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
