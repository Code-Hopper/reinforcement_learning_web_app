import { user } from '../models/users.js';
import jwt from 'jsonwebtoken';

async function validateUserHandler(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const foundUser = await user.findById(decoded.id);
        if (!foundUser) {
            return res.status(401).json({ message: 'Invalid user' });
        }
        req.user = foundUser; // Attach user to request object
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

export { validateUserHandler };