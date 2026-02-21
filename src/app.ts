import express from "express"
import cors from "cors"
import taskRouter from "./modules/tasks/tasks.routes"
import { errorHandler } from "./middleware/errorHandler"

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
app.use(express.json())
app.use("/api", taskRouter)
app.use(errorHandler)

app.get("/health", (_, res) => {
  res.json({ message: "API running" })
})


export default app