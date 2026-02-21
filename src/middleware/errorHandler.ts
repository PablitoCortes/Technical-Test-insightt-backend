import { Request, Response, NextFunction } from "express"
import { UnauthorizedError } from "express-oauth2-jwt-bearer"

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof UnauthorizedError) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    })
  }

  console.error(err)

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  })
}