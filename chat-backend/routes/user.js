const express = require('express');
const router = express.Router();

// Example: Get user details
router.get('/:id', (req, res) => {
    const userId = req.params.id;
    // Logic to get user details by id
    res.send(`User details for user ID: ${userId}`);
});

module.exports = router;
