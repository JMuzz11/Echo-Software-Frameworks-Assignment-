// Import necessary modules
const users = require('./userController').users; // Import users array from userController

// Function to handle user login
exports.login = (req, res) => {
    const { username, password } = req.body;

    // Find the user by username
    const user = users.find(user => user.username === username);

    // Check if user exists and password matches
    if (user && user.password === password) {
        // Simple way to "log in" the user
        res.status(200).json({ 
            message: 'Login successful',
            user: { id: user.id, username: user.username, roles: user.roles }
        });
    } else {
        // Respond with error if login fails
        res.status(401).json({ message: 'Invalid username or password' });
    }
};

// Middleware for role-based access control
exports.requireRole = (role) => {
    return (req, res, next) => {
        const { roles } = req.body;

        if (roles && roles.includes(role)) {
            next(); // Allow access
        } else {
            res.status(403).json({ message: 'Access denied' });
        }
    };
};
