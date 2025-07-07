// routes/userRoutes.js
import express from "express";
import {
    UserLogin,
    UserRegister,
    AccessDashboard,
    GetQuestion,
    StoreAnswers,
    FetchAllTest
} from "../controllers/userActions.js";
import { validateUserHandler } from "../auth/validateUser.js";

let userRouter = express();

userRouter.post("/login", UserLogin);
userRouter.post("/register", UserRegister);
userRouter.get("/dashboard", validateUserHandler, AccessDashboard);
userRouter.post("/generate-questions", validateUserHandler, GetQuestion);

//  New route to store MCQ answers
userRouter.post("/store-answers", validateUserHandler, StoreAnswers);

userRouter.get("/all-tests", validateUserHandler, FetchAllTest);

export { userRouter };
