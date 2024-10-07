const express = require('express');
const router = express.Router();
const User = require('../models/User');

// User login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && user.password === password) {
            res.json({
                message: 'Login successful',
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    roles: user.roles,
                    groups: user.groups
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// User registration route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'Username already exists' });

        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: 'Email already exists' });

        const newUser = new User({ username, email, password });
        await newUser.save();
        res.json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = { router };
