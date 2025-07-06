import express from "express"

import { UserLogin, UserRegister, AccessDashboard } from "../controllers/userActions.js"
import { validateUserHandler } from "../auth/validateUser.js"

let userRouter = express()

userRouter.post("/login", UserLogin)

userRouter.post("/register", UserRegister)

userRouter.get("/dashboard", validateUserHandler, AccessDashboard)

export { userRouter }