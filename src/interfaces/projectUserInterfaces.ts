import { Request } from 'express'

export interface ProjectUserInterface {
    functionProject: string
    userID: string
    projectID: string
}

export interface ProjectUserRequest extends Request {
    body: ProjectUserInterface
    verifiedUserID?: string
}
