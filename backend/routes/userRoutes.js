import express from 'express';
import { User } from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// User login
router.post('/login', async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'User ID and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Password comparison removed (no hashing)
    if (password !== user.password) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, 'key-to-open', { expiresIn: '0.5h' });
    res.json({ token, role: user.role });
});

// User registration
router.post('/register', async (req, res) => {
    console.log(req.body);
    const { name, email, password, role } = req.body;

    if (!email || !password || !role || !name) {
        return res.status(400).json({ message: 'User Details are required' });
    }

    const useremailExists = await User.findOne({ email });
    if (useremailExists) {
        return res.status(401).json({ message: 'User Email already exists' });
    }

    // No hashing for password
    const user = new User({ name, email, password, role });
    try {
        const savedUser = await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            userId: savedUser._id, // Include the `userId` in the response
            role: savedUser.role,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
