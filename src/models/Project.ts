import { Schema, model } from 'mongoose'

const ProjectSchema = new Schema({
  title: String,
  description: String,
  begin: String,
  end: String,
  userID: String
}, {
  timestamps: true
})

export default model('Project', ProjectSchema)
