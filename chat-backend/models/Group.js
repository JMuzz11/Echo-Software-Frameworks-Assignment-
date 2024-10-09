const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);
