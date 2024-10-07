const express = require('express');
const router = express.Router();
const Channel = require('../models/Channel');
const Group = require('../models/Group');

// Create a new channel for a group
router.post('/:groupId/channels', async (req, res) => {
    const groupId = req.params.groupId;
    const { channelName } = req.body;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const newChannel = new Channel({
            name: channelName,
            groupId: group._id,
        });

        const savedChannel = await newChannel.save();

        group.channels.push(savedChannel._id);
        await group.save();

        res.json({ message: `Channel ${channelName} created for group ${groupId}`, channel: savedChannel });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all channels for a group
router.get('/:groupId/channels', async (req, res) => {
    const groupId = req.params.groupId;

    try {
        const group = await Group.findById(groupId).populate('channels');
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.json(group.channels);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a channel
router.put('/:groupId/channels/:channelId', async (req, res) => {
    const groupId = req.params.groupId;
    const channelId = req.params.channelId;
    const { channelName } = req.body;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        channel.name = channelName;
        const updatedChannel = await channel.save();

        res.json({ message: `Channel ${channelId} updated`, channel: updatedChannel });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a channel
router.delete('/:groupId/channels/:channelId', async (req, res) => {
    const groupId = req.params.groupId;
    const channelId = req.params.channelId;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const channelIndex = group.channels.indexOf(channelId);
        if (channelIndex === -1) {
            return res.status(404).json({ message: 'Channel not found in group' });
        }

        await Channel.findByIdAndDelete(channelId);
        group.channels.splice(channelIndex, 1);
        await group.save();

        res.json({ message: `Channel ${channelId} deleted from group ${groupId}` });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = { router };
