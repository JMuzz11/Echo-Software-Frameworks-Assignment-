const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }]
});

module.exports = mongoose.model('Group', groupSchema);
