import * as dotenv from 'dotenv'
dotenv.config()

export default {
  username: process.env.MONGO_USERNAME ?? '',
  password: encodeURIComponent(process.env.MONGO_PASSWORD ?? ''),
  secret: process.env.SECRET ?? ''
}
