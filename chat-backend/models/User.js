const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    roles: { type: [String], default: ['User'] },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    profileImage: String,  // Optional for storing profile images
});

module.exports = mongoose.model('User', userSchema);
