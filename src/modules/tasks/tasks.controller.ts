import { Request, Response } from "express"
import { tasksService } from "./tasks.service"
import { sendResponse, sendError } from "../../middleware/ApiResponse"
import { AppError } from "../../errors/AppError"

export const taskController = {

  getTasks: async (req: Request, res: Response) => {
    if (!req.user) {
      return sendError(res, 401, "Unauthorized")
    }

    try {
      const tasks = await tasksService.getTasks(req.user.id)
      return sendResponse(res, 200, "Tasks retrieved successfully", tasks)
    } catch (error) {
      if (error instanceof AppError) {
        return sendError(res, error.statusCode, error.message)
      }

      return sendError(res, 500, "Internal server error")
    }
  },

  createTask: async (req: Request, res: Response) => {
    if (!req.user) {
      return sendError(res, 401, "Unauthorized")
    }

    try {
      const task = await tasksService.createTask(req.user.id, req.body)
      return sendResponse(res, 201, "Task created successfully", task)
    } catch (error) {
      if (error instanceof AppError) {
        return sendError(res, error.statusCode, error.message)
      }

      return sendError(res, 500, "Internal server error")
    }
  },

  updateTask: async (req: Request, res: Response) => {
    if (!req.user) {
      return sendError(res, 401, "Unauthorized")
    }

    try {
      const task = await tasksService.updateTask(
        req.user.id,
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

  deleteTask: async (req: Request, res: Response) => {
    if (!req.user) {
      return sendError(res, 401, "Unauthorized")
    }

    try {
      await tasksService.deleteTask(req.user.id, req.params.id)
      return res.status(204).send()
    } catch (error) {
      if (error instanceof AppError) {
        return sendError(res, error.statusCode, error.message)
      }

      return sendError(res, 500, "Internal server error")
    }
  }
}