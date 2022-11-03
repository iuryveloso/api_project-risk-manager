import { Request, Response } from 'express'
import Task from '@models/Task'
import { TaskInterface, TaskRequest } from '@interfaces/taskInterfaces'

class TaskController {
  public async get (req: TaskRequest, res: Response) {
    const projectID = req.params.projectID
    try {
      const tasks = await Task.find({ projectID, parentTaskID: undefined }).sort({ begin: 'asc' }).collation({
        caseLevel: true,
        locale: 'pt'
      })
      return res.status(200).json(tasks)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async getWithParent (req: TaskRequest, res: Response) {
    const projectID = req.params.projectID
    const parentTaskID = req.params.parentTaskID
    try {
      const tasks = await Task.find({ projectID, parentTaskID }).sort({ begin: 'asc' }).collation({
        caseLevel: true,
        locale: 'pt'
      })
      return res.status(200).json(tasks)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async getOne (req: TaskRequest, res: Response) {
    const id = req.params.id
    try {
      const task = await Task.findById(id)
      return res.status(200).json(task)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async create (req: TaskRequest, res: Response) {
    const { begin, description, end, title, parentTaskID, projectID } = req.body

    const task = new Task({
      begin,
      description,
      end,
      title,
      parentTaskID,
      projectID

    })

    try {
      await Task.create(task)
      return res.status(201).json({ message: 'Tarefa cadastrado com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async update (req: TaskRequest, res: Response) {
    const id = req.params.id
    const { begin, description, end, title, parentTaskID, projectID } = req.body

    const task: TaskInterface = {
      begin,
      description,
      end,
      title,
      parentTaskID,
      projectID
    }

    try {
      const updatedTask = await Task.updateOne({ _id: id }, task)

      if (updatedTask.matchedCount === 0) {
        return res.status(422).json({ message: 'Tarefa não encontrado!' })
      }

      return res.status(201).json({ message: 'Tarefa atualizado com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async delete (req: Request, res: Response) {
    const id = req.params.id
    try {
      const task = await Task.findOne({ _id: id })

      if (!task) {
        return res.status(422).json({ message: 'Tarefa não encontrado!' })
      }

      await Task.deleteOne({ _id: id })

      return res.status(200).json({ message: 'Tarefa removido com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }
}

export default new TaskController()
