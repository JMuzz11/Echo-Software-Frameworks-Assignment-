const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: [{ type: String, enum: ['User', 'Super Admin', 'Group Admin'], default: 'User' }],
  avatar: { type: String, default: 'uploads/default-avatar.png' }, // Path to the avatar image file
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
