import { Schema, model } from 'mongoose'

const TaskSchema = new Schema({
  title: String,
  description: String,
  responsible: String,
  begin: String,
  end: String,
  projectID: String,
  parentTaskID: String
}, {
  timestamps: true
})

export default model('Task', TaskSchema)
