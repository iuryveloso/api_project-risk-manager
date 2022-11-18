import { Request, Response } from 'express'
import Project from '@models/Project'
import { ProjectInterface, ProjectRequest } from '@interfaces/projectInterfaces'

class ProjectController {
  public async list (req: ProjectRequest, res: Response) {
    const userID = req.verifiedUserID as string
    try {
      const projects = await Project.find({ userID }).sort({ title: 'asc' }).collation({
        caseLevel: true,
        locale: 'pt'
      })
      return res.status(200).json(projects)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async get (req: ProjectRequest, res: Response) {
    const id = req.params.id
    try {
      const projects = await Project.findById(id)
      return res.status(200).json(projects)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async create (req: ProjectRequest, res: Response) {
    const { begin, description, end, title, occupationArea } = req.body

    const project = new Project({
      begin,
      description,
      occupationArea,
      end,
      title,
      userID: req.verifiedUserID as string
    })

    try {
      await Project.create(project)
      return res.status(201).json({ message: 'Projeto cadastrado com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async update (req: ProjectRequest, res: Response) {
    const id = req.params.id
    const userID = req.verifiedUserID as string
    const { begin, description, end, title, occupationArea } = req.body

    const project: ProjectInterface = {
      begin,
      description,
      occupationArea,
      end,
      title,
      userID
    }

    try {
      const updatedProject = await Project.updateOne({ _id: id }, project)

      if (updatedProject.matchedCount === 0) {
        return res.status(422).json({ message: 'Projeto não encontrado!' })
      }

      return res.status(201).json({ message: 'Projeto atualizado com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }

  public async delete (req: Request, res: Response) {
    const id = req.params.id
    try {
      const project = await Project.findOne({ _id: id })

      if (!project) {
        return res.status(422).json({ message: 'Projeto não encontrado!' })
      }

      await Project.deleteOne({ _id: id })

      return res.status(200).json({ message: 'Projeto removido com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Aconteceu algum erro, tente novamente mais tarde!' })
    }
  }
}

export default new ProjectController()
