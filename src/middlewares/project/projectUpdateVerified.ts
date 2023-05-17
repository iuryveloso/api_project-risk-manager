import { Response, NextFunction } from 'express'
import { ProjectRequest } from '@interfaces/projectInterfaces'
import Task from '@models/Task'

export default async function ProjectUpdateVerified (req: ProjectRequest, res: Response, next: NextFunction) {
  const { begin, description, end, title, occupationArea, cost } = req.body
  const id = req.params.id

  if (!title) {
    return res.status(422).json({ error: 'O Título é obrigatório' })
  }
  if (!description) {
    return res.status(422).json({ error: 'A Descrição é obrigatória' })
  }
  if (!occupationArea) {
    return res.status(422).json({ error: 'A Área de Atuação é obrigatória' })
  }
  if (!begin) {
    return res.status(422).json({ error: 'A Data de Início é obrigatória' })
  }
  if (!end) {
    return res.status(422).json({ error: 'A Data de Término é obrigatória' })
  }
  if (cost < 0) {
    return res.status(422).json({ error: 'O Custo é obrigatório' })
  }

  const tasks = await Task.find({ projectID: id, parentTaskID: undefined })

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

  const hasBeginBefore = tasks.filter((task) => task.begin && task.begin < begin)
  const hasEndAfter = tasks.filter((task) => task.end && task.end > end)

  if (hasBeginBefore.length > 0) {
    const hasBeginBeforeSorted = hasBeginBefore.sort((a, b) => getSort(a.begin as string, b.begin as string, 'asc'))
    return res.status(422).json({
      error: `A data de Início tem que ser anterior ou igual à ${hasBeginBeforeSorted[0].begin?.split('-')[2]}/${
      hasBeginBeforeSorted[0].begin?.split('-')[1]
    }/${hasBeginBeforeSorted[0].begin?.split('-')[0]} `
    })
  }

  if (hasEndAfter.length > 0) {
    const hasEndAfterSorted = hasEndAfter.sort((a, b) => getSort(a.end as string, b.end as string, 'desc'))
    return res.status(422).json({
      error: `A data de Término tem que ser posterior ou igual à ${hasEndAfterSorted[0].end?.split('-')[2]}/${
        hasEndAfterSorted[0].end?.split('-')[1]
    }/${hasEndAfterSorted[0].end?.split('-')[0]} `
    })
  }

  if (begin > end) {
    return res.status(422).json({ error: 'A Data de Início tem que ser anterior ou igual à data de Término' })
  }

  next()
}
