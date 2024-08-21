const express = require('express');
const router = express.Router();
const { users } = require('./auth.js'); // Importing the users array from auth.js


let groups = [];        // In-memory groups array

// Create a new group
router.post('/create', (req, res) => {
    const { groupName, adminId } = req.body;

    const admin = users.find(user => user.id === adminId);            // Validate adminId
    if (!admin) {
        return res.status(404).json({ message: 'Admin user not found' });
    }

    const newGroup = {                  // Create the group object
        id: groups.length + 1,
        name: groupName,
        admins: [adminId],
        members: [adminId]              // Admin is automatically a member
    };

    groups.push(newGroup);              // Add the group to the groups array
    admin.groups.push(newGroup.id);     // Add the group to the admin's groups

    res.json({ message: `Group created with name: ${groupName}`, group: newGroup });
});

// Get all groups
router.get('/', (req, res) => {
    res.json(groups);                 // Return the list of all groups
});

module.exports = {
    router,
    groups
};
