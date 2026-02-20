import mongoose, { Schema, Document } from "mongoose"
import { TaskStatus } from "./tasks.types"

export interface ITask extends Document {
  title: string
  description?: string
  status: TaskStatus
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.PENDING
    },
    ownerId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export const Task = mongoose.model<ITask>("Task", TaskSchema)