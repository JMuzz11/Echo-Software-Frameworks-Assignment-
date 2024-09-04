const express = require('express');
const router = express.Router();
const { groups } = require('./group'); 

// Channels are stored in each group under a 'channels' array

// Create a new channel for a group
router.post('/:groupId/channels', (req, res) => {
    const groupId = parseInt(req.params.groupId);
    const { channelName } = req.body;

    const group = groups.find(g => g.id === groupId);
    if (!group) {
        return res.status(404).json({ message: 'Group not found' });
    }

    const newChannel = {
        id: group.channels ? group.channels.length + 1 : 1,
        name: channelName
    };

    group.channels = group.channels || [];  // Ensure the group has a channels array
    group.channels.push(newChannel);

    res.json({ message: `Channel ${channelName} created for group ${groupId}`, channel: newChannel });
});

// Get all channels for a group
router.get('/:groupId/channels', (req, res) => {
    const groupId = parseInt(req.params.groupId);

    const group = groups.find(g => g.id === groupId);
    if (!group) {
        return res.status(404).json({ message: 'Group not found' });
    }

    res.json(group.channels || []);
});

// Update a channel
router.put('/:groupId/channels/:channelId', (req, res) => {
    const groupId = parseInt(req.params.groupId);
    const channelId = parseInt(req.params.channelId);
    const { channelName } = req.body;

    const group = groups.find(g => g.id === groupId);
    if (!group) {
        return res.status(404).json({ message: 'Group not found' });
    }

    const channel = group.channels.find(c => c.id === channelId);
    if (!channel) {
        return res.status(404).json({ message: 'Channel not found' });
    }

    channel.name = channelName;

    res.json({ message: `Channel ${channelId} updated`, channel });
});

// Delete a channel
router.delete('/:groupId/channels/:channelId', (req, res) => {
    const groupId = parseInt(req.params.groupId);
    const channelId = parseInt(req.params.channelId);

    const group = groups.find(g => g.id === groupId);
    if (!group) {
        return res.status(404).json({ message: 'Group not found' });
    }

    group.channels = group.channels.filter(c => c.id !== channelId);

    res.json({ message: `Channel ${channelId} deleted from group ${groupId}` });
});

module.exports = { router };
