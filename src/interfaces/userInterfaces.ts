import { Request } from 'express'

export interface UserInterface {
    email?: string
    occupation?: string
    company?: string
    firstName?: string
    lastName?: string
    avatar?: string
    password?: string
    confirmPassword?: string
    newPassword?: string

}

export interface UserRequest extends Request {
    body: UserInterface
    verifiedUserID?: string
    avatarError?: string
    userError?: string
}
