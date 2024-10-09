const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
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
        console.error('Error creating group:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all groups
router.get('/', async (req, res) => {
    try {
        const groups = await Group.find().populate('admins').populate('members').populate('channels');
        res.json(groups);
    } catch (err) {
        console.error('Error fetching groups:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a specific group by ID
router.get('/:id', async (req, res) => {
    try {
        const groupId = req.params.id; // No need to convert explicitly here unless necessary
        const group = await Group.findById(groupId).populate('admins').populate('members').populate('channels');

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.json(group);
    } catch (err) {
        console.error('Error fetching group:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get groups for a specific user
router.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId).populate('groups');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userGroups = await Group.find({ _id: { $in: user.groups } })
                                      .populate('admins')
                                      .populate('members')
                                      .populate('channels');
        res.json(userGroups);
    } catch (err) {
        console.error('Error fetching groups for user:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a group
router.delete('/:id', async (req, res) => {
    const groupId = req.params.id;
    try {
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
        console.error('Error deleting group:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a user to a group
router.post('/:groupId/addUser', async (req, res) => {
    const { groupId } = req.params;
    const { userId } = req.body;

    try {
        // Find the group
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is already a member of the group
        if (group.members.includes(user._id)) {
            return res.status(400).json({ message: 'User is already a member of the group' });
        }

        // Add the user to the group's members
        group.members.push(user._id);

        // Add the group to the user's groups
        user.groups.push(group._id);

        // Save changes
        await group.save();
        await user.save();

        res.json({ message: 'User added to the group successfully', group });
    } catch (err) {
        console.error('Error adding user to group:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = { router };
