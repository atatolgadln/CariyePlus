const mongoose = require('mongoose');

const welcomeSchema = new mongoose.Schema({
	Guild: String,
	Channel: String,
	BMessage: String,
	WMessage: String,
});

module.exports = mongoose.model('welcome-chanel', welcomeSchema);