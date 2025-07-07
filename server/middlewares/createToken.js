import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
dotenv.config({ path: "./config.env" })

const SECRET_KEY = process.env.JWT_SECRET

function createToken(id) {
    if (!id) {
        throw new Error('Email is required to create a token');
    }
    const payload = { id };
    const options = { expiresIn: '1h' }; // Token expires in 1 hour
    return jwt.sign(payload, SECRET_KEY, options);
}

export { createToken };