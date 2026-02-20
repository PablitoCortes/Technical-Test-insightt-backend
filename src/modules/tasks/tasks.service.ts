import { Task } from "./task.model"
import { CreateTaskDTO, TaskStatus, UpdateTaskDTO } from "./tasks.types"
import { AppError } from "../../errors/AppError"
import axios from "axios"

export const tasksService = {
  getTasks: async (ownerId: string) => {
    return await Task.find({ ownerId })
  },

  createTask: async (ownerId: string, task: CreateTaskDTO) => {
    return await Task.create({
      title: task.title,
      description: task.description || "",
      status: TaskStatus.PENDING,
      ownerId
    })
  },

  updateTask: async (
    ownerId: string,
    taskId: string,
    updateData: UpdateTaskDTO
  ) => {

    const task = await Task.findOne({ _id: taskId, ownerId })

    if (!task) {
      throw new AppError("Task not found", 404)
    }

    if (task.status === TaskStatus.ARCHIVED) {
      throw new AppError("Archived tasks cannot be modified", 400)
    }

    if (updateData.status === TaskStatus.DONE) {
      throw new AppError(
        "Use the complete endpoint to mark task as DONE",
        400
      )
    }

    if (updateData.status !== undefined) {

      if (updateData.status === task.status) {
        throw new AppError(
          `Task is already in ${task.status} status`,
          400
        )
      }

      const validTransitions: Record<TaskStatus, TaskStatus[]> = {
        PENDING: [TaskStatus.IN_PROGRESS],
        IN_PROGRESS: [],
        DONE: [TaskStatus.ARCHIVED],
        ARCHIVED: []
      }

      if (!validTransitions[task.status].includes(updateData.status)) {
        throw new AppError(
          `Invalid status transition from ${task.status} to ${updateData.status}`,
          400
        )
      }
    }

    if (task.status === TaskStatus.DONE) {
      if (
        updateData.description !== undefined ||
        updateData.status !== undefined
      ) {
        throw new AppError(
          "Only title can be edited for completed tasks",
          400
        )
      }
    }

    if (updateData.title !== undefined) {
      task.title = updateData.title
    }

    if (updateData.description !== undefined) {
      task.description = updateData.description
    }

    if (updateData.status !== undefined) {
      task.status = updateData.status
    }

    await task.save()

    return task
  },
  completeTask: async (ownerId: string, taskId: string) => {

    const task = await Task.findOne({ _id: taskId, ownerId })

    if (!task) {
      throw new AppError("Task not found", 404)
    }

    if (task.status !== TaskStatus.IN_PROGRESS) {
      throw new AppError(
        "Task must be IN_PROGRESS to be marked as DONE",
        400
      )
    }

    const response = await axios.post(
      "http://localhost:4000/complete",
      { taskId }
    )

    if (!response.data.approved) {
      throw new AppError(
        "Task completion rejected by external service",
        400
      )
    }

    task.status = TaskStatus.DONE
    await task.save()

    return task
  },

  deleteTask: async (ownerId: string, taskId: string) => {
    const task = await Task.findById(taskId)

    if (!task) {
      throw new AppError("Task not found", 404)
    }

    if (task.ownerId.toString() !== ownerId) {
      throw new AppError("Unauthorized", 403)
    }

    await task.deleteOne()

    return { message: "Task deleted successfully" }
  }
}