// routes/userRoutes.js
import express from "express";
import {
    UserLogin,
    UserRegister,
    AccessDashboard,
    GetQuestion,
    StoreAnswers,
    FetchAllTest,
    GetTopicsToLearn,
    UpdateUserProgress
} from "../controllers/userActions.js";
import { validateUserHandler } from "../auth/validateUser.js";
import { user } from "../models/users.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/login", UserLogin);
userRouter.post("/register", UserRegister);

// Auth-protected routes
userRouter.get("/dashboard", validateUserHandler, AccessDashboard);
userRouter.post("/generate-questions", validateUserHandler, GetQuestion);
userRouter.post("/store-answers", validateUserHandler, StoreAnswers);
userRouter.get("/all-tests", validateUserHandler, FetchAllTest);

// New route to fetch learning topics
userRouter.get("/topics-to-learn", validateUserHandler, GetTopicsToLearn);

userRouter.post("/update-progress", validateUserHandler, UpdateUserProgress);

userRouter.post("/update-profile", validateUserHandler, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(userId)
        const { points, skills } = req.body;

        console.log(points, skills)

        const updated = await user.findByIdAndUpdate(
            userId,
            { points, skills },
            { new: true }
        );

        res.status(200).json({
            message: "Profile updated",
            user: {
                fullName: updated.fullName,
                email: updated.email,
                points: updated.points,
                skills: updated.skills
            }
        });
    } catch (err) {
        console.error("Update profile error:", err);
        res.status(500).json({ message: "Failed to update profile" });
    }
});

export { userRouter };