import { Response, NextFunction } from 'express'
import { TaskRequest } from '@interfaces/taskInterfaces'
import Task from '@models/Task'
import Project from '@models/Project'

export default async function TaskUpdateVerified (req: TaskRequest, res: Response, next: NextFunction) {
  const { begin, description, end, title, responsible, parentTaskID, projectID } = req.body
  const id = req.params.id

  const tasks = await Task.find({ parentTaskID: id })

  const hasBeginBefore = tasks.filter((task) => task.begin && task.begin < begin)
  const hasEndAfter = tasks.filter((task) => task.end && task.end > end)

  function getSort (aDate: string, bDate: string, direction: 'asc' | 'desc') {
    if (aDate > bDate) {
      if (direction === 'asc') {
        return 1
      } else {
        return -1
      }
    } else if (aDate < bDate) {
      if (direction === 'desc') {
        return 1
      } else {
        return -1
      }
    } else {
      return 0
    }
  }

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

  if (hasBeginBefore.length > 0) {
    const hasBeginBeforeSorted = hasBeginBefore.sort((a, b) => getSort(a.begin as string, b.begin as string, 'asc'))
    return res.status(422).json({
      error: `A data de Início tem que ser anterior ou igual à ${hasBeginBeforeSorted[0].begin?.split('-')[2]}/${
      hasBeginBeforeSorted[0].begin?.split('-')[1]
    }/${hasBeginBeforeSorted[0].begin?.split('-')[0]}`
    })
  }

  if (hasEndAfter.length > 0) {
    const hasEndAfterSorted = hasEndAfter.sort((a, b) => getSort(a.end as string, b.end as string, 'desc'))
    return res.status(422).json({
      error: `A data de Término tem que ser posterior ou igual à ${hasEndAfterSorted[0].end?.split('-')[2]}/${
        hasEndAfterSorted[0].end?.split('-')[1]
    }/${hasEndAfterSorted[0].end?.split('-')[0]}`
    })
  }

  if (begin > end) {
    return res.status(422).json({ error: 'A Data de Início tem que ser anterior ou igual à data de Término' })
  }

  next()
}
