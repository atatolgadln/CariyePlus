const { Schema, model } = require('mongoose');

const Starboard = new Schema({
	Guild:String,
	Channel: String,
});

module.exports = model('Starboard', Starboard);