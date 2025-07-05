import { user } from '../models/users.js'; // Adjust path as needed
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"

dotenv.config({ path: "./config.env" })

const JWT_SECRET = process.env.JWT_SECRET

async function UserLogin(req, res) {
    // Implement user login logic here
    // Example: extract credentials from req.body, validate, respond
    res.json({ message: 'UserLogin not implemented yet.' });
}


async function UserRegister(req, res) {
    console.log("register route called !")
    try {

        console.log(req.body)

        const { fullName, email, password } = req.body;

        // Basic validation
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check if email already exists
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            console.log("user already exist !")
            return res.status(409).json({ message: 'Email already registered.' });
        }

        // Create new user (password will be hashed by the model's pre-save hook)
        const newUser = new user({ fullName, email, password });
        await newUser.save();

        // Send response (omit password)
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


export {
    UserLogin,
    UserRegister
};