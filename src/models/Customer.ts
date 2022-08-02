import { Schema, model } from 'mongoose'

const CustomerSchema = new Schema({
  email: String,
  firstName: String,
  lastName: String,
  address: String,
  phone: String,
  birthDate: Date
}, {
  timestamps: true
})

export default model('Customer', CustomerSchema)
