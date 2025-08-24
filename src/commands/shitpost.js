/* eslint-disable no-shadow */
const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

class ShitpostCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'shitpost',
			description: 'sends a shitpost',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('shitpost')
				.setDescription('sends a shitpost'),
		);
	}

	async chatInputRun(interaction) {
		const json = await fetch('https://meme-api.com/gimme/shitposting').then((res) => res.json());
		const embed = new EmbedBuilder()
			.setTitle(json.title)
			.setURL(json.postLink)
			.setImage(json.url)
			.setFooter({ text: `r/${json.subreddit} | 👍 ${json.ups}` });

		return interaction.reply({
			embeds: [embed],
		});
	}
}

module.exports = {
	ShitpostCommand,
};