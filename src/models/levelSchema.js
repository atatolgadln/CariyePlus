const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
	Guild: String,
	Channel: String,
});

module.exports = mongoose.model('levelup-channel', levelSchema);