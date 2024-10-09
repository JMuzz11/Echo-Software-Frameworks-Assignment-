const express = require('express');
const router = express.Router();
const User = require('../models/User');

// User login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (user && user.password === password) {
            // Respond with the user details, excluding the password for security
            res.json({
                message: 'Login successful',
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    roles: user.roles,
                    avatar: user.avatar,
                    groups: user.groups
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// User registration route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if username or email already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Create a new user
        const newUser = new User({ username, email, password });
        await newUser.save();

        // Return the user details excluding password
        res.json({
            message: 'User registered successfully',
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                roles: newUser.roles,
                avatar: 'uploads/default-avatar.png' ,
                groups: newUser.groups
            }
        });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = { router };
