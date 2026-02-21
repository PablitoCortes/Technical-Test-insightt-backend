import express, { Request, Response } from "express"
const app = express()
app.use(express.json())

app.post("/complete", (req: Request, res: Response) => {
  const { taskId } = req.body
  return res.json({
    approved: true,
    taskId
  })
})

app.listen(4000, () => {
  console.log("Completion service running on port 4000")
})