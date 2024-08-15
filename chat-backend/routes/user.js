const express = require('express');
const { createUser, getUsers, initializeSuperAdmin } = require('../controllers/userController.js');
const router = express.Router();

// Route to create a new user
router.post('/', createUser);

// Route to get all users (optional)
router.get('/', getUsers);

// Initialize Super Admin
initializeSuperAdmin();

module.exports = router;
