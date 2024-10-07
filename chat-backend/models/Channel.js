const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
});

module.exports = mongoose.model('Channel', channelSchema);
