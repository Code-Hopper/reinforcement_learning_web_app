import { user } from '../models/users.js'; // Adjust path as needed
import dotenv from "dotenv"
import { createToken } from '../middlewares/createToken.js';
import bcrypt from "bcrypt";

dotenv.config({ path: "./config.env" })

async function UserLogin(req, res) {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Find user by email
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Compare passworda
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Create token
        const token = createToken(existingUser._id);

        // Optionally store token in user document for further validation
        existingUser.token = token;
        await existingUser.save();

        // Respond with token and user info (omit password)
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


async function AccessDashboard(req, res) {
    try {
        // req.user is set by validateUserHandler middleware
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized access.' });
        }

        // You can customize the dashboard data as needed
        res.status(200).json({
            message: 'Dashboard access granted.',
            user: {
                id: req.user._id,
                fullName: req.user.fullName,
                email: req.user.email
            }
        });
    } catch (error) {
        console.error('Dashboard access error:', error);
        res.status(500).json({ message: 'Server error during dashboard access.' });
    }
}

export {
    UserLogin,
    UserRegister,
    AccessDashboard
};