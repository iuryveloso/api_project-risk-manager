import { Response } from 'express'
import { sign } from 'jsonwebtoken'
import { UserInterface, SessionUserInterface } from '@interfaces/userInterfaces'
import env from '@rootDir/env.config'

function createToken (userID: string) {
  const secret = env.jwtSecret
  const token = sign({ userID }, secret)
  return token
}

export function saveToken (userID: string, res: Response) {
  const token = createToken(userID)
  res.cookie('Jwt', token, {
    httpOnly: true,
    secure: env.jwtSecure !== 'development',
    sameSite: 'strict',
    path: '/'
  })
}

export function saveUserOnSession (user: UserInterface, sessionUser: SessionUserInterface) {
  sessionUser.firstName = user.firstName
  sessionUser.lastName = user.lastName
  sessionUser.avatar = user.avatar
  sessionUser.email = user.email
}
