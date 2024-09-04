const express = require('express');
const router = express.Router();
const { users } = require('./auth'); // Import the users array from auth.js

router.get('/users', (req, res) => {
    res.json(users); // Assuming 'users' is an array of all user objects
  });

// Get user details by ID
router.get('/:id', (req, res) => {
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

module.exports = router;
