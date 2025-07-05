import express from "express"

import { UserLogin, UserRegister } from "../controllers/userActions.js"

let userRouter = express()

userRouter.get("/login", UserLogin)

userRouter.post("/register", UserRegister)

export { userRouter }