import { Request, Response } from 'express'
import RiskTask from '@models/RiskTask'
import { RiskTaskRequest } from '@interfaces/riskTaskInterfaces'

class RiskTaskController {
  public async list (req: RiskTaskRequest, res: Response) {
    const riskID = req.params.riskID
    try {
      const riskTasks = await RiskTask.find({ riskID })
      return res.status(200).json(riskTasks)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async create (req: RiskTaskRequest, res: Response) {
    const { riskID, taskID } = req.body

    const riskTask = new RiskTask({
      riskID,
      taskID
    })
    try {
      await RiskTask.create(riskTask)
      return res.status(201).json({ message: 'Tarefa adicionada com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async delete (req: Request, res: Response) {
    const riskID = req.params.riskID
    const taskID = req.params.taskID
    try {
      const riskTask = await RiskTask.find({ riskID, taskID })

      if (!riskTask) {
        return res.status(422).json({ message: 'Risco não encontrado!' })
      }

      await RiskTask.deleteMany({ riskID, taskID })

      return res.status(200).json({ message: 'Tarefa removida com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }
}

export default new RiskTaskController()
