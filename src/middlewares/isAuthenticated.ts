import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
// import { parse } from 'cookie'
import endpoints from '@rootDir/endpoints.config'

interface IsAuthenticatedRequest extends Request {
    verifiedUserID?: string
}

const isAuthenticated = (req: IsAuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.Jwt

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado!' })
  }
  try {
    const secret = endpoints.jwtSecret
    const decoded = verify(token, secret)
    req.verifiedUserID = (<any>decoded).userID
    next()
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: 'Token inválido!' })
  }
}

export default isAuthenticated
