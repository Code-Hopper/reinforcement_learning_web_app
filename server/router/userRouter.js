// routes/userRoutes.js
import express from "express";
import {
    UserLogin,
    UserRegister,
    AccessDashboard,
    StoreAnswers,
    FetchAllTest,
    leaderBoardData,
    queryForTopic,
    GetQuizFromLearnedTags,
    updateUserPoints
} from "../controllers/userActions.js";
import { validateUserHandler } from "../auth/validateUser.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/login", UserLogin);
userRouter.post("/register", UserRegister);

// Auth-protected routes
userRouter.get("/dashboard", validateUserHandler, AccessDashboard);

userRouter.get("/all-tests", validateUserHandler, FetchAllTest);

userRouter.post("/store-answers", validateUserHandler, StoreAnswers);

userRouter.get("/leader-board-data", validateUserHandler, leaderBoardData);

userRouter.put("/update-points/:userId", validateUserHandler, updateUserPoints);

// call ai routes

userRouter.post("/query-for-topic", validateUserHandler, queryForTopic);

userRouter.get("/daily-quiz", validateUserHandler, GetQuizFromLearnedTags);

export { userRouter };