const express = require('express');
const router = express.Router();

//User login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Add your login logic here
    res.send('Login route');
});

//User registration route
router.post('/register', (req, res) => {
    const { username, password, email } = req.body;
    // Add your registration logic here
    res.send('Register route');
});

module.exports = router;
