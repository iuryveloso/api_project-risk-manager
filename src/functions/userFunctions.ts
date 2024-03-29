import { Response } from 'express'
import { sign } from 'jsonwebtoken'
import QueryString from 'qs'
import axios from 'axios'
import fileSystem from 'fs-extra'
import env from '@src/env.config'
import path from 'path'
import { randomUUID } from 'crypto'

interface GoogleOAuthTokensInterface {
  access_token: string
  expires_in: string
  refresh_token: string
  scope: string
  id_token: string
}
interface GoogleUserInterface {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}

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

export async function getGoogleOAuthTokens (code: string): Promise<GoogleOAuthTokensInterface | undefined> {
  const url = 'https://oauth2.googleapis.com/token'

  const values = {
    code,
    client_id: env.googleClientId,
    client_secret: env.googleClientSecret,
    redirect_uri: env.googleRedirectUri,
    grant_type: 'authorization_code'
  }
  try {
    const response = await axios.post<GoogleOAuthTokensInterface>(
      url,
      QueryString.stringify(values),
      {
        headers: { 'Content-type': 'application/x-www-form-urlencoded' }
      }
    )

    return response.data
  } catch (error) {
    console.log(error)
  }
}

export async function getGoogleUser (idToken: string, accessToken: string): Promise<GoogleUserInterface | undefined> {
  try {
    const response = await axios.get<GoogleUserInterface>(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }
    )
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export async function downloadAvatarImageFromGoogle (url: string, filepath: string) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })
  const filename = () => {
    switch (response.headers['content-type']) {
      case 'image/jpeg':
        return `${randomUUID()}-google.jpg`
      case 'image/jpg':
        return `${randomUUID()}-google.jpg`
      case 'image/png':
        return `${randomUUID()}-google.png`
      case 'image/svg':
        return `${randomUUID()}-google.svg`
      default:
        return `${randomUUID()}-google`
    }
  }
  const filePathWithfilename = path.join(filepath, filename())
  return new Promise((resolve, reject) => {
    response.data.pipe(fileSystem.createWriteStream(filePathWithfilename))
      .on('error', reject)
      .once('close', () => resolve(filePathWithfilename))
  })
}

export function removeImage (avatar: string) {
  fileSystem.remove(`./uploads/${avatar}`)
    .catch(err => console.error(err))
}
