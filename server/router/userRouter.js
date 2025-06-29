import express from "express"

import { UserLogin, UserRegister } from "../controllers/userActions.js"

let userRouter = express()

userRouter.get("/", UserLogin)

userRouter.get("/register", UserRegister)

export { userRouter }