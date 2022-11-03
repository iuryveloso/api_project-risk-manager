import { Request } from 'express'

export interface ProjectInterface {
    title: string
    description: string
    begin: string
    end: string
    userID: string
}

export interface ProjectRequest extends Request {
    body: ProjectInterface
    verifiedUserID?: string
}
