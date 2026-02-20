import express from "express"
import cors from "cors"
import taskRouter from "./modules/tasks/tasks.routes"

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api", taskRouter)

app.get("/health", (_, res) => {
  res.json({ message: "API running" })
})

import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "express-oauth2-jwt-bearer";

app.use(
  (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof UnauthorizedError) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
);

export default app