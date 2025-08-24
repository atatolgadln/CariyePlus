const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

class TweetCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'tweet',
			description: 'create tweet image',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('tweet')
				.setDescription('create tweet image')
				.addStringOption((option) =>
					option
						.setName('username')
						.setDescription('name')
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName('text')
						.setDescription('text')
						.setRequired(true),
				),
		);
	}

	async chatInputRun(interaction) {
		const us = interaction.options.getString('username');
		const te = interaction.options.getString('text');

		await axios.get(`https://nekobot.xyz/api/imagegen?type=tweet&username=${encodeURIComponent(us)}&text=${encodeURIComponent(te)}`).then(response => {
			const image = response.data.message;
			const embed = new EmbedBuilder()
				.setImage(image)
				.setColor('Random');

			return interaction.reply({ embeds: [embed] });
		});
	}
}

module.exports = {
	TweetCommand,
};