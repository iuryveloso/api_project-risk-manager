import { Request } from 'express'

export interface ActionInterface {
    title: string
    description: string
    type: string
    responsible: string
    status: string
    observation: string
    riskID: string
}

export interface ActionRequest extends Request {
    body: ActionInterface
}
