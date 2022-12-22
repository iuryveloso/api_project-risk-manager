import { Request, Response, NextFunction } from 'express'
import { JwtPayload, verify } from 'jsonwebtoken'
import env from '@src/env.config'

interface IsAuthenticatedRequest extends Request {
    verifiedUserID?: string
}

interface DecodedInterface extends JwtPayload {
  userID?: string
}

export default function isAuthenticated (req: IsAuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.cookies.Jwt
  if (!token) {
    return res.status(401).json({ message: 'Acesso negado!' })
  }
  try {
    const secret = env.jwtSecret
    const decoded: string | DecodedInterface = verify(token, secret)
    if (typeof decoded !== 'string') {
      req.verifiedUserID = decoded.userID
    }
    next()
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: 'Token inválido!' })
  }
}
