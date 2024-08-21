const express = require('express');
const router = express.Router();
const { groups } = require('./group.js'); // Import the groups array from group.js

let channels = [];      // In-memory channels array

// Create a new channel within a group
router.post('/create', (req, res) => {
    const { channelName, groupId } = req.body;

    const group = groups.find(g => g.id === parseInt(groupId));              // Validate groupId
    if (!group) {
        return res.status(404).json({ message: 'Group not found' });
    }

    const newChannel = {             // Create the channel object
        id: channels.length + 1,
        name: channelName,
        groupId: parseInt(groupId),
        members: group.members       // Initially, all group members have access to the channel
    };
    channels.push(newChannel);       // Add the channel to the channels array

    if (!group.channels) {           // Add the channel to the group's channels list
        group.channels = [];
    }
    group.channels.push(newChannel.id);

    res.json({ message: `Channel created with name: ${channelName} in group ID: ${groupId}`, channel: newChannel });
});

router.get('/:groupId', (req, res) => {               // Get all channels in a group
    const groupId = parseInt(req.params.groupId);

    const group = groups.find(g => g.id === groupId);                // Validate groupId
    if (!group) {
        return res.status(404).json({ message: 'Group not found' });
    }

    const groupChannels = channels.filter(channel => channel.groupId === groupId);      // Get all channels for the group
    res.json(groupChannels);
});

module.exports = router;
