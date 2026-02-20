import { Router } from "express";
import { taskController } from "./tasks.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const taskRouter = Router()

taskRouter.use(authMiddleware)

taskRouter.get("/tasks", taskController.getTasks)
taskRouter.post("/tasks", taskController.createTask)
taskRouter.put("/tasks/:id", taskController.updateTask)
taskRouter.put("/tasks/:id/markAsDone", taskController.completeTask)
taskRouter.delete("/tasks/:id", taskController.deleteTask)

export default taskRouter
