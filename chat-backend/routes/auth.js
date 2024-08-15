const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

// Route for logging in
router.post('/auth/login', authController.login);

// Route to initialize Super Admin (for testing purpose)
router.post('/initialize-superadmin', userController.initializeSuperAdmin);

// Example protected route for Super Admins
router.get('/admin', authController.requireRole('Super Admin'), (req, res) => {
    res.json({ message: 'Welcome, Super Admin!' });
});

// Example protected route for Group Admins
router.get('/group-admin', authController.requireRole('Group Admin'), (req, res) => {
    res.json({ message: 'Welcome, Group Admin!' });
});

// Example route to list users
router.get('/users', userController.getUsers);

module.exports = router;
