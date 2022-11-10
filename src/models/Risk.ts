import { Schema, model } from 'mongoose'

const RiskSchema = new Schema({
  title: String,
  description: String,
  category: String,
  causes: String,
  probability: Number,
  impact: Number,
  observations: String,
  projectID: String
}, {
  timestamps: true
})

export default model('Risk', RiskSchema)
