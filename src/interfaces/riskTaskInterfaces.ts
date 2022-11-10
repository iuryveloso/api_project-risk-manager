import { Request } from 'express'

export interface RiskTaskInterface {
    riskID: string
    taskID: string
}

export interface RiskTaskRequest extends Request {
    body: RiskTaskInterface
}
