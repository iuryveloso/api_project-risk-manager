import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
  email: String,
  firstName: String,
  lastName: String,
  avatar: String,
  password: String
}, {
  timestamps: true
})

export default model('User', UserSchema)
