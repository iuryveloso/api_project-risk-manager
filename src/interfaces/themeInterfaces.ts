import { Request } from 'express'
import { Session } from 'express-session'

export interface SessionThemeInterface extends Session {
    theme?: string
}

export interface ThemeRequest extends Request {
    body: SessionThemeInterface
    session: SessionThemeInterface
}
