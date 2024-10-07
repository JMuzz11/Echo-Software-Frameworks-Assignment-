const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET user by ID
router.get('/users/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId).select('-password'); // Exclude password
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT (Update user by ID)
router.put('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const updatedData = req.body;

    try {
        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select('-password');
        if (user) {
            res.json({ message: 'User updated successfully', user });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE user by ID
router.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByIdAndDelete(userId);
        if (user) {
            res.json({ message: `User with id ${userId} deleted successfully.` });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
