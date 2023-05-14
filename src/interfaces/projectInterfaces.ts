import { Request } from 'express'

export interface ProjectInterface {
    title: string
    description: string
    occupationArea: string
    begin: string
    end: string
    cost: number
    userID: string
}

export interface ProjectRequest extends Request {
    body: ProjectInterface
    verifiedUserID?: string
}
