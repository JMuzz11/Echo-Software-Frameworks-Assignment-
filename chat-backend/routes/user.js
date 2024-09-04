const express = require('express');
const router = express.Router();
const { users } = require('./auth'); // Import the users array from auth.js

// GET all users
router.get('/users', (req, res) => {
    res.json(users); // Send all users as a response
});

// GET user by ID
router.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);

    // Find the user by ID
    const user = users.find(u => u.id === userId);

    if (user) {
        // Exclude password from the response
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// PUT (Update user by ID)
router.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const updatedData = req.body;

    // Find the user by ID
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        // Update user data in the array (excluding password)
        users[userIndex] = { ...users[userIndex], ...updatedData };
        res.json({ message: 'User updated successfully', user: users[userIndex] });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// DELETE user by ID
router.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        users.splice(userIndex, 1); // Remove the user from the array
        res.json({ message: `User with id ${userId} deleted successfully.` });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

module.exports = router;
