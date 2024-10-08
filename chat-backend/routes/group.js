const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const User = require('../models/User');

// Create a new group
router.post('/create', async (req, res) => {
    const { groupName, adminId } = req.body;
    try {
        const admin = await User.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin user not found' });
        }

        const newGroup = new Group({
            name: groupName,
            admins: [admin._id],
            members: [admin._id]
        });

        const savedGroup = await newGroup.save();
        admin.groups.push(savedGroup._id);
        await admin.save();

        res.json({ message: `Group created with name: ${groupName}`, group: savedGroup });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all groups
router.get('/', async (req, res) => {
    try {
        const groups = await Group.find().populate('admins').populate('members').populate('channels');
        res.json(groups);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a group
router.delete('/:id', async (req, res) => {
    const groupId = req.params.id;
    try {
        // Find and delete the group
        const group = await Group.findByIdAndDelete(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Remove the group ID from users who are associated with this group
        await User.updateMany(
            { groups: groupId },
            { $pull: { groups: groupId } }
        );

        res.json({ message: `Group with ID: ${groupId} deleted successfully` });
    } catch (err) {
        console.error('Error deleting group:', err); // Log the error for debugging
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = { router };
