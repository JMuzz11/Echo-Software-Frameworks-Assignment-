const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Group = require('../models/Group');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get messages for a group
router.get('/:groupId', async (req, res) => {
  try {
    const groupId = req.params.groupId;
    // Convert the groupId to a MongoDB ObjectId
    const messages = await Message.find({ groupId: mongoose.Types.ObjectId(groupId) }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error('Error retrieving messages:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Post a new message
router.post('/groups/:id/messages', async (req, res) => {
  const { senderId, senderName, senderAvatar, content } = req.body;
  const groupId = req.params.id;

  try {
      // Find the group
      const group = await Group.findById(groupId);
      if (!group) {
          return res.status(404).json({ message: 'Group not found' });
      }

      // Create a new message
      const newMessage = new Message({
          groupId,
          senderId,
          senderName,
          senderAvatar,
          content
      });

      // Save the message
      const savedMessage = await newMessage.save();

      // Add the message reference to the group's messages array
      group.messages.push(savedMessage._id);
      await group.save();

      res.json(savedMessage);
  } catch (err) {
      console.error('Error adding message:', err);
      res.status(500).json({ message: 'Server error' });
  }
});
module.exports = { router };
