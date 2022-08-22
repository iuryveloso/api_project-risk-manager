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
  if (user.firstName) {
    sessionUser.firstName = user.firstName
  }
  if (user.lastName) {
    sessionUser.lastName = user.lastName
  }
  if (user.avatar) {
    sessionUser.avatar = user.avatar
  }
  if (user.email) {
    sessionUser.email = user.email
  }
}
export function getUserOnSession (sessionUser: SessionUserInterface) {
  const user: UserInterface = {
    firstName: sessionUser.firstName,
    lastName: sessionUser.lastName,
    avatar: sessionUser.avatar,
    email: sessionUser.email
  }
  return user
}
