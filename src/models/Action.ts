import { Schema, model } from 'mongoose'

const ActionSchema = new Schema({
  title: String,
  description: String,
  type: String,
  responsible: String,
  status: String,
  cost: Number,
  observation: String,
  riskID: String
}, {
  timestamps: true
})

export default model('Action', ActionSchema)
