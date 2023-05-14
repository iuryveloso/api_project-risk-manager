import { Schema, model } from 'mongoose'

const ProjectSchema = new Schema({
  title: String,
  description: String,
  occupationArea: String,
  begin: String,
  end: String,
  cost: Number,
  userID: String
}, {
  timestamps: true
})

export default model('Project', ProjectSchema)
