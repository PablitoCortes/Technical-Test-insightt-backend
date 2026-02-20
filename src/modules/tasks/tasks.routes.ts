import { Router } from "express";
import { taskController } from "./tasks.controller";


const router = Router()

router.get("/tasks", taskController.getTasks)
router.post("/tasks", taskController.createTask)
router.put("/tasks/:id", taskController.updateTask)
router.delete("/tasks/:id", taskController.deleteTask)

export default router
