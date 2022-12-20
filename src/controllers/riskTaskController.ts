import { Request, Response } from 'express'
import RiskTask from '@models/RiskTask'
import { RiskTaskRequest } from '@interfaces/riskTaskInterfaces'
import Task from '@models/Task'

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

  public async listByTask (req: RiskTaskRequest, res: Response) {
    const taskID = req.params.taskID
    try {
      const riskTasks = await RiskTask.find({ taskID })
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
    const task = await Task.findById(taskID)
    let saveCounter: number = 0
    try {
      async function saveChildTasks (taskID: string) {
        const childTasks = await Task.find({ parentTaskID: taskID })
        childTasks.forEach(async (childTask) => {
          if (childTask._id) {
            const childTaskId = childTask._id.toString()
            const isChildTasksaved = riskTasks.filter((riskTask) => {
              return riskTask.taskID?.includes(childTaskId) && riskTask.riskID?.includes(riskID)
            })
            if (isChildTasksaved.length === 0) {
              saveCounter++
              await RiskTask.create({ riskID, taskID: childTaskId })
              await saveChildTasks(childTaskId)
            }
          }
        })
      }
      async function saveParentTasks (taskID: string) {
        const parentTask = await Task.findById(taskID)
        const siblingsTasks = await Task.find({ parentTaskID: taskID })
        const siblingsTasksSaved = siblingsTasks.filter((siblingTask) => {
          if (siblingTask._id) {
            return riskTasks.filter((riskTask) => {
              return riskTask.taskID?.includes(siblingTask._id.toString()) && riskTask.riskID?.includes(riskID)
            }).length > 0
          } else return false
        })
        console.log({ a: siblingsTasks.length, b: siblingsTasksSaved.length })
        if (siblingsTasks.length === siblingsTasksSaved.length) {
          saveCounter++
          await RiskTask.create({ taskID, riskID })
          await saveParentTasks(parentTask?.parentTaskID as string)
        }
      }
      await RiskTask.create(riskTask)

      const riskTasks = await RiskTask.find()
      await saveChildTasks(taskID)
      await saveParentTasks(task?.parentTaskID as string)

      return res.status(201).json({ message: saveCounter > 0 ? 'Tarefas adicionadas com sucesso!' : 'Tarefa adicionada com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async delete (req: Request, res: Response) {
    const riskID = req.params.riskID
    const taskID = req.params.taskID
    const task = await Task.findById(taskID)
    let deleteCounter: number = 0
    try {
      const riskTask = await RiskTask.find({ riskID, taskID })

      if (!riskTask) {
        return res.status(422).json({ message: 'Risco não encontrado!' })
      }

      const riskTasks = await RiskTask.find()
      async function deleteChildTasks (taskID: string) {
        const childTasks = await Task.find({ parentTaskID: taskID })
        childTasks.forEach(async (childTask) => {
          if (childTask._id) {
            const childTaskId = childTask._id.toString()
            const isChildTasksaved = riskTasks.filter((riskTask) => {
              return riskTask.taskID?.includes(childTaskId) && riskTask.riskID?.includes(riskID)
            })
            if (isChildTasksaved.length > 0) {
              deleteCounter++
              await RiskTask.deleteMany({ riskID, taskID: childTaskId })
              await deleteChildTasks(childTaskId)
            }
          }
        })
      }

      async function deleteParentTasks (taskID: string) {
        const parentTask = await Task.findById(taskID)
        const isParentTaskSaved = riskTasks.filter((riskTask) => {
          if (parentTask?._id) {
            return riskTask.taskID?.includes(parentTask?._id.toString()) && riskTask.riskID?.includes(riskID)
          } else return false
        }).length > 0
        if (isParentTaskSaved) {
          deleteCounter++
          await RiskTask.deleteMany({ taskID: parentTask?._id.toString(), riskID })
          await deleteParentTasks(parentTask?.parentTaskID as string)
        }
      }

      await RiskTask.deleteMany({ riskID, taskID })
      await deleteChildTasks(taskID)
      await deleteParentTasks(task?.parentTaskID as string)
      return res.status(200).json({ message: deleteCounter > 0 ? 'Tarefas removidas com sucesso!' : 'Tarefa removida com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }
}

export default new RiskTaskController()
