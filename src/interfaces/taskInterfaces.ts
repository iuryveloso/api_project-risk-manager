import { Request } from 'express'

export interface TaskInterface {
    title: string
    description: string
    responsible: string
    begin: string
    end: string
    projectID: string
    parentTaskID: string
}

export interface TaskRequest extends Request {
    body: TaskInterface
}
