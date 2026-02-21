import { Task } from "./task.model"
import { CreateTaskDTO, TaskStatus, UpdateTaskDTO } from "./tasks.types"
import { AppError } from "../../errors/AppError"
import axios, { AxiosError } from "axios"

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

  editTask: async (
    ownerId: string,
    taskId: string,
    updateData: UpdateTaskDTO
  ) => {
    const task = await Task.findOne({ _id: taskId, ownerId })

    if (!task) {
      throw new AppError("Task not found", 404)
    }

    if (updateData.status === TaskStatus.DONE && task.status !== TaskStatus.DONE) {
      throw new AppError("Use the complete endpoint to mark task as DONE", 400)
    }

    if (task.status === TaskStatus.ARCHIVED) {
      throw new AppError("Archived tasks cannot be modified", 400)
    }

    if (task.status === TaskStatus.DONE) {
      const isDescriptionChanging = updateData.description !== undefined && updateData.description !== task.description
      const isStatusChanging = updateData.status !== undefined && updateData.status !== (task.status as TaskStatus)

      if (isDescriptionChanging || isStatusChanging) {
        throw new AppError(
          "Only title can be edited for completed tasks",
          400
        )
      }
    }

    if (!updateData.title && !updateData.description && !updateData.status) {
      throw new AppError("At least one field must be updated", 400)
    }
    if (updateData.status && updateData.status !== task.status) {
      const validTransitions: Record<TaskStatus, TaskStatus[]> = {
        PENDING: [TaskStatus.IN_PROGRESS],
        IN_PROGRESS: [], // IN_PROGRESS can only move to DONE via markAsDone
        DONE: [TaskStatus.ARCHIVED],
        ARCHIVED: []
      }

      if (!validTransitions[task.status].includes(updateData.status)) {
        throw new AppError(
          `Invalid status transition from ${task.status} to ${updateData.status}`,
          400
        )
      }
      task.status = updateData.status
    }

    if (updateData.title !== undefined) {
      task.title = updateData.title
    }

    if (updateData.description !== undefined) {
      task.description = updateData.description
    }

    await task.save()

    return task
  },

  moveTask: async (
    ownerId: string,
    taskId: string,
    newStatus: TaskStatus
  ) => {

    const task = await Task.findOne({ _id: taskId, ownerId })

    if (!task) {
      throw new AppError("Task not found", 404)
    }

    if (task.status === TaskStatus.ARCHIVED) {
      throw new AppError("Archived tasks cannot be moved", 400)
    }

    if (newStatus === TaskStatus.DONE) {
      throw new AppError(
        "Use the complete endpoint to mark task as DONE",
        400
      )
    }

    if (newStatus === task.status) {
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

    if (!validTransitions[task.status].includes(newStatus)) {
      throw new AppError(
        `Invalid status transition from ${task.status} to ${newStatus}`,
        400
      )
    }

    task.status = newStatus
    await task.save()

    return task
  },

  markAsDone: async (ownerId: string, taskId: string) => {
    const task = await Task.findOne({ _id: taskId, ownerId });

    if (!task) {
      throw new AppError("Task not found", 404);
    }
    if (task.status === TaskStatus.DONE) {
      return task;
    }

    if (task.status !== TaskStatus.IN_PROGRESS) {
      throw new AppError("Task must be IN_PROGRESS to be marked as DONE", 400);
    }

    try {
      const response = await axios.post("http://localhost:4000/complete", { taskId });

      if (!response.data.approved) {
        throw new AppError("Task completion rejected by external service", 400);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new AppError("External service unavailable", 503);
      }
      throw new AppError("Unexpected error contacting external service", 500);
    }

    task.status = TaskStatus.DONE;
    await task.save();

    return task;
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