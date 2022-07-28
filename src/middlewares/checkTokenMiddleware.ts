import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import endpoints from '@rootDir/endpoints.config'

interface CheckTokenMiddlewareRequest extends Request {
    verifiedUserID?: string
}

const checkTokenMiddleware = (req: CheckTokenMiddlewareRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1] ?? ''
  if (!token) {
    res.status(401).json({ message: 'Acesso negado!' })
  }
  try {
    const secret = endpoints.secret
    const decoded = verify(token, secret)
    req.verifiedUserID = (<any>decoded).id
    next()
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Token inválido!' })
  }
}

export default checkTokenMiddleware
