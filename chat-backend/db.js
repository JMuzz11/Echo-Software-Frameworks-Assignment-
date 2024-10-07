const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/echo-chat';

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
    initializeSuperAdmin(); // Initialize the super admin user after connecting to MongoDB
})
.catch(err => console.error('Could not connect to MongoDB', err));

// Import User model for initializing the super admin
const User = require('./models/User');


// Function to initialize the super admin user
async function initializeSuperAdmin() {
    try {
        // Check if the super admin already exists
        const existingSuperAdmin = await User.findOne({ username: 'super' });
        if (existingSuperAdmin) {
            console.log('Super admin already exists');
            return;
        }

        // Create the super admin user
        const superAdmin = new User({
            username: 'super',
            password: '123',
            email: 'super@super.com',
            roles: ['Super Admin']
        });

        await superAdmin.save();
        console.log('Super admin initialized');
    } catch (error) {
        console.error('Error initializing super admin:', error);
    }
}

// Export the mongoose connection for use elsewhere in the app
module.exports = mongoose.connection;
