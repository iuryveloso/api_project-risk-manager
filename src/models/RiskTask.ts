import { Schema, model } from 'mongoose'

const RiskTaskSchema = new Schema({
  riskID: String,
  taskID: String
}, {
  timestamps: true
})

export default model('RiskTask', RiskTaskSchema)
