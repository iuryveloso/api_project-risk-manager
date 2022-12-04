import { Schema, model } from 'mongoose'

const ProjectSchema = new Schema({
  functionProject: String,
  userID: String,
  projectID: String
}, {
  timestamps: true
})

export default model('ProjectUser', ProjectSchema)
