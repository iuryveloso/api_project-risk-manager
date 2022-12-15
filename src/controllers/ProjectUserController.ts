import { Request, Response } from 'express'
import ProjectUser from '@models/ProjectUser'
import { ProjectUserRequest } from '@interfaces/projectUserInterfaces'

class ProjectUserController {
  public async list (req: ProjectUserRequest, res: Response) {
    const userID = req.params.userID
    try {
      const projectUser = await ProjectUser.find({ userID })
      return res.status(200).json(projectUser)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async listByProject (req: ProjectUserRequest, res: Response) {
    const projectID = req.params.projectID
    try {
      const projectUser = await ProjectUser.find({ projectID })
      return res.status(200).json(projectUser)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async get (req: ProjectUserRequest, res: Response) {
    const userID = req.params.userID
    const projectID = req.params.projectID
    try {
      const projectUser = await ProjectUser.findOne({ userID, projectID })
      return res.status(200).json(projectUser)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async create (req: ProjectUserRequest, res: Response) {
    const { userID, projectID, functionProject } = req.body

    const projectUser = new ProjectUser({
      userID,
      projectID,
      functionProject
    })
    try {
      await ProjectUser.create(projectUser)
      return res.status(201).json({ message: 'Tarefa adicionada com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async delete (req: Request, res: Response) {
    const userID = req.params.userID
    const projectID = req.params.projectID
    try {
      const projectUser = await ProjectUser.find({ userID, projectID })

      if (!projectUser) {
        return res.status(422).json({ message: 'Risco não encontrado!' })
      }

      await ProjectUser.deleteMany({ projectID, userID })

      return res.status(200).json({ message: 'Tarefa removida com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }
}

export default new ProjectUserController()
