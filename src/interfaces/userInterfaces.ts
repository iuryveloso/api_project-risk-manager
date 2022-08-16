import { Request } from 'express'
import { Session } from 'express-session'

export interface UserInterface {
    email?: string
    firstName?: string
    lastName?: string
    avatar?: string
    password?: string
    confirmPassword?: string
    newPassword?: string

}

export interface SessionUserInterface extends Session {
    email?: string
    firstName?: string
    lastName?: string
    avatar?: string
}

export interface UserRequest extends Request {
    body: UserInterface
    verifiedUserID?: string
    avatarError?: string
    userError?: string
    session: SessionUserInterface
}
