import dotenv from "dotenv"
import app from "./app"
import { connectDB } from "./config/DbConection"

dotenv.config()

const PORT = process.env.PORT || 3000


const startServer = async () => {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer()