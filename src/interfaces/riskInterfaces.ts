import { Request } from 'express'

export interface RiskInterface {
    title: string,
    description: string,
    category: string,
    causes: string,
    probabilityPositive: number
    impactPositive: number
    probabilityNegative: number
    impactNegative: number
    observations: string
    projectID: string
}

export interface RiskRequest extends Request {
    body: RiskInterface
}
