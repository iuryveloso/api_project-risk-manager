import { Schema, model } from 'mongoose'

const RiskSchema = new Schema({
  title: String,
  description: String,
  category: String,
  causes: String,
  probabilityPositive: Number,
  impactPositive: Number,
  probabilityNegative: Number,
  impactNegative: Number,
  observations: String,
  status: String,
  projectID: String
}, {
  timestamps: true
})

export default model('Risk', RiskSchema)
