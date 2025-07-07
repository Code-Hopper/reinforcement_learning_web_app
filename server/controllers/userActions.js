import { user } from '../models/users.js';
import dotenv from "dotenv";
import { createToken } from '../middlewares/createToken.js';
import bcrypt from "bcrypt";
import axios from 'axios';
import AnswerModel from "../models/answer.js";

dotenv.config({ path: "./config.env" });

async function UserLogin(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = createToken(existingUser._id);
        existingUser.token = token;
        await existingUser.save();

        res.status(200).json({
            message: 'Login successful.',
            token,
            user: {
                id: existingUser._id,
                fullName: existingUser.fullName,
                email: existingUser.email
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login.' });
    }
}

async function UserRegister(req, res) {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered.' });
        }

        const newUser = new user({ fullName, email, password });
        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully.',
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
}

async function AccessDashboard(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized access.' });
        }

        res.status(200).json({
            message: 'Dashboard access granted.',
            user: {
                id: req.user._id,
                fullName: req.user.fullName,
                email: req.user.email,
                createdAt: req.user.createdAt,
            }
        });
    } catch (error) {
        console.error('Dashboard access error:', error);
        res.status(500).json({ message: 'Server error during dashboard access.' });
    }
}

async function GetQuestion(req, res) {
    try {
        const { query, level, difficulty } = req.body;
        if (!query) {
            return res.status(400).json({ message: "Query is required" });
        }

        const flaskResponse = await axios.post("http://localhost:8000/generate-questions", {
            query,
            level,
            difficulty
        });

        const { questions, suggestedTopics } = flaskResponse.data;
        res.status(200).json({ questions, suggestedTopics });
    } catch (error) {
        console.error("GetQuestion error:", error?.response?.data || error.message);
        res.status(500).json({ message: 'Server error during question generation.' });
    }
}

async function StoreAnswers(req, res) {
    try {
        const userId = req.user.id;
        const { topic, answers } = req.body;

        if (!topic || !Array.isArray(answers)) {
            return res.status(400).json({ message: "Invalid request data" });
        }

        const correctAnswers = answers.filter(ans => ans.isCorrect).length;
        const totalQuestions = answers.length;
        const creditPoints = correctAnswers * 10;

        // Example skill level logic
        let skillLevel = 'Beginner';
        const accuracy = correctAnswers / totalQuestions;
        if (accuracy >= 0.9) skillLevel = 'Expert';
        else if (accuracy >= 0.7) skillLevel = 'Intermediate';

        const entry = new AnswerModel({
            userId,
            topic,
            answers,
            createdAt: new Date()
        });

        await entry.save();

        res.status(201).json({
            message: "Answers stored successfully",
            correctAnswers,
            totalQuestions,
            creditPoints,
            skillLevel
        });
    } catch (error) {
        console.error("StoreAnswers Error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

async function FetchAllTest(req, res) {
    try {
        const userId = req.user.id;
        const tests = await AnswerModel.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ tests });
    } catch (error) {
        console.error("GetAllStoredTests Error:", error);
        res.status(500).json({ message: "Server error while fetching stored tests." });
    }
}

async function GetTopicsToLearn(req, res) {
    try {
        const topics = [
            "JavaScript",
            "React",
            "Python",
            "AI Fundamentals",
            "MongoDB",
            "HTML & CSS",
            "Cybersecurity Basics",
            "Data Structures",
        ];
        res.status(200).json({ topics });
    } catch (error) {
        console.error("GetTopicsToLearn Error:", error);
        res.status(500).json({ message: "Server error while fetching topics." });
    }
}

async function UpdateUserProgress(req, res) {
    try {
        const userId = req.user.id;
        const { points, skill } = req.body;

        const userDoc = await user.findById(userId);
        if (!userDoc) {
            return res.status(404).json({ message: "User not found" });
        }

        if (typeof points === 'number') {
            userDoc.points += points;
        }

        if (skill && !userDoc.skills.includes(skill)) {
            userDoc.skills.push(skill);
        }

        await userDoc.save();

        res.status(200).json({
            message: "Progress updated",
            user: {
                fullName: userDoc.fullName,
                email: userDoc.email,
                points: userDoc.points,
                skills: userDoc.skills
            }
        });
    } catch (err) {
        console.error("UpdateUserProgress error:", err);
        res.status(500).json({ message: "Failed to update user progress" });
    }
}


export {
    UserLogin,
    UserRegister,
    AccessDashboard,
    GetQuestion,
    StoreAnswers,
    FetchAllTest,
    GetTopicsToLearn,
    UpdateUserProgress
};