import { Request } from 'express'

export interface RiskInterface {
    title: string,
    description: string,
    category: string,
    causes: string,
    probability: number,
    impact: number,
    observations: string,
    projectID: string
}

export interface RiskRequest extends Request {
    body: RiskInterface
}
