import { Response, NextFunction } from 'express'
import { TaskRequest } from '@interfaces/taskInterfaces'
import Task from '@models/Task'
import Project from '@models/Project'

export default async function TaskCreateVerified (req: TaskRequest, res: Response, next: NextFunction) {
  const { begin, description, end, title, responsible, parentTaskID, projectID } = req.body

  async function getBeginEnd () {
    if (parentTaskID) {
      const task = await Task.findById(parentTaskID)
      return { begin: task?.begin as string, end: task?.end as string }
    } else {
      const project = await Project.findById(projectID)
      return { begin: project?.begin as string, end: project?.end as string }
    }
  }
  const dates = await getBeginEnd()

  if (!title) {
    return res.status(422).json({ error: 'O Título é obrigatório' })
  }
  if (!description) {
    return res.status(422).json({ error: 'A Descrição é obrigatória' })
  }
  if (!responsible) {
    return res.status(422).json({ error: 'O Responsável é obrigatório' })
  }
  if (!begin) {
    return res.status(422).json({ error: 'A Data de Início é obrigatória' })
  }
  if (!end) {
    return res.status(422).json({ error: 'A Data de Término é obrigatória' })
  }

  if (begin < dates.begin) {
    return res.status(422).json({
      error: `A data de Início tem que ser posterior ou igual à ${dates.begin?.split('-')[2]}/${
      dates.begin?.split('-')[1]
    }/${dates.begin?.split('-')[0]}`
    })
  }

  if (end > dates.end) {
    return res.status(422).json({
      error: `A data de Término tem que ser anterior ou igual à ${dates.end?.split('-')[2]}/${
      dates.end?.split('-')[1]
    }/${dates.end?.split('-')[0]}`
    })
  }

  next()
}
