const users = [];  // In-memory storage for Phase 1

// Function to initialize the Super Admin
exports.initializeSuperAdmin = () => {
    const superAdmin = {
        id: '1',
        username: 'super',
        email: 'super@email.com',
        password: '123',
        roles: ['Super Admin'],
        groups: []
    };

    // Add Super Admin to the users array if it doesn't already exist
    const existingSuperAdmin = users.find(user => user.username === superAdmin.username);
    if (!existingSuperAdmin) {
        users.push(superAdmin);
        console.log('Super Admin initialized');
    }
};

// Function to create a new user
exports.createUser = (req, res) => {
    const { username, email, roles, password } = req.body;

    // Basic validation (e.g., check if username is unique)
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = { 
        id: (users.length + 1).toString(), 
        username, 
        email, 
        password, 
        roles: ['User'], 
        groups: [] 
    };
    users.push(newUser);
    
    res.status(201).json(newUser);
};

// Function to get all users (for debugging or listing purposes)
exports.getUsers = (req, res) => {
    res.json(users);
};
