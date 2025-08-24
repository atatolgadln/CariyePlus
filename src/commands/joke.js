const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

class JokeCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'joke',
			description: 'get a random joke',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('joke')
				.setDescription('get a random joke'),
		);
	}

	async chatInputRun(interaction) {
		axios.get('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single').then(response => {
			const joke = response.data.joke;
			const embed = new EmbedBuilder()
				.setDescription(joke)
				.setColor('Random');
			return interaction.reply({ embeds: [embed] });
		});
	}
}

module.exports = {
	JokeCommand,
};