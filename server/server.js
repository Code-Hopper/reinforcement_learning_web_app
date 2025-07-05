import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import "./database/conn.js"

import { userRouter } from "./router/userRouter.js"

dotenv.config({ path: "./config.env" })

const port = process.env.PORT

const app = express()


let corsOptions = {
    method: "*",
    origin: "*"
}

app.use(cors(corsOptions))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use("/api/user", userRouter)

app.listen(port, () => {
    console.log(`Server is running on port : ${port} | http://localhost:${port} !`)
})