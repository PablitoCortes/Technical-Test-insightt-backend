import { Request, Response } from "express"
import { tasksService } from "./tasks.service"
import { sendResponse, sendError } from "../../middleware/ApiResponse"
import { AppError } from "../../errors/AppError"
import { AuthResult } from "express-oauth2-jwt-bearer"

export const taskController = {

  getTasks: async (
    req: Request,
    res: Response) => {
    if (!req.auth) {
      return sendError(res, 401, "Unauthorized")
    }

    const userId = req.auth.payload.sub as string

    try {
      const tasks = await tasksService.getTasks(userId)
      return sendResponse(res, 200, "Tasks retrieved successfully", tasks)
    } catch (error) {
      if (error instanceof AppError) {
        return sendError(res, error.statusCode, error.message)
      }

      return sendError(res, 500, "Internal server error")
    }
  },

  createTask: async (
    req: Request,
    res: Response) => {
    if (!req.auth) {
      return sendError(res, 401, "Unauthorized")
    }

    const userId = req.auth.payload.sub as string
    try {
      const task = await tasksService.createTask(userId, req.body)
      return sendResponse(res, 201, "Task created successfully", task)
    } catch (error) {
      if (error instanceof AppError) {
        return sendError(res, error.statusCode, error.message)
      }

      return sendError(res, 500, "Internal server error")
    }
  },

  updateTask: async (
    req: Request<{ id: string }>,
    res: Response) => {
    if (!req.auth) {
      return sendError(res, 401, "Unauthorized")
    }

    const userId = req.auth.payload.sub as string
    try {
      const task = await tasksService.updateTask(
        userId,
        req.params.id,
        req.body
      )

      return sendResponse(res, 200, "Task updated successfully", task)
    } catch (error) {
      if (error instanceof AppError) {
        return sendError(res, error.statusCode, error.message)
      }

      return sendError(res, 500, "Internal server error")
    }
  },

  completeTask: async (
    req: Request<{ id: string }>,
    res: Response) => {
    if (!req.auth) {
      return sendError(res, 401, "Unauthorized")
    }

    const userId = req.auth.payload.sub as string
    try {
      const task = await tasksService.completeTask(userId, req.params.id)
      return sendResponse(res, 200, "Task completed successfully", task)
    } catch (error) {
      if (error instanceof AppError) {
        return sendError(res, error.statusCode, error.message)
      }

      return sendError(res, 500, "Internal server error")
    }
  },

  deleteTask: async (req: Request<{ id: string }>, res: Response) => {
    if (!req.auth) {
      return sendError(res, 401, "Unauthorized")
    }
    const userId = req.auth.payload.sub as string
    try {
      await tasksService.deleteTask(userId, req.params.id)
      return sendResponse(res, 204, "Task deleted successfully")
    } catch (error) {
      if (error instanceof AppError) {
        return sendError(res, error.statusCode, error.message)
      }

      return sendError(res, 500, "Internal server error")
    }
  }
}