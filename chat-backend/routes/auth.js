const express = require('express');
const router = express.Router();

let users = [];                     // In-memory users array (Superuser is added at server start)

const superUser = {                 // Add Superuser when the server starts
    id: 1,
    username: 'super',
    password: '123',
    email: 'super@example.com',
    roles: ['Super Admin'],
    groups: []
};

if (!users.find(user => user.username === superUser.username)) {    // Ensure the superuser is added to the users array
    users.push(superUser);
    console.log("superuser added")
}

// User login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);   // Find the user by username

    if (user) {                             
        if (user.password === password) {                   // Check if the password matches
            res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    roles: user.roles,
                    groups: user.groups
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid password' });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});


// User registration route
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    
    if (users.find(u => u.username === username)) {                            // Check if username already exists
        return res.status(400).json({ message: 'Username already exists' });
    }
    if (users.find(u => u.email === email)) {                                  // Check if email already exists
        return res.status(400).json({ message: 'Email already exists' });
    }
    
    const newUser = {                                                          // Create a new user
        id: users.length + 1,
        username,
        email,
        password,
        roles: ['User'], // Default role
        groups: []
    };

    users.push(newUser);
    res.json({ message: 'User registered successfully', user: newUser });
});

module.exports = {
    router,
    users
};
