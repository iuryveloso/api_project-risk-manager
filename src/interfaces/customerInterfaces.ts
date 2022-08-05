import { Request } from 'express'

export interface CustomerInterface {
    email: string
    firstName: string
    lastName: string
    address: string
    phone: string
    birthDate: Date
}

export interface CustomerRequest extends Request {
    body: CustomerInterface
}
