import express from "express"
import dotenv from "dotenv"

import { userRouter } from "./router/userRouter.js"

dotenv.config({ path: "./config.env" })

const port = process.env.PORT

const app = express()

app.use("/user", userRouter)

app.listen(port, () => {
    console.log(`Server is running on port : ${port} | http://localhost:${port} !`)
})