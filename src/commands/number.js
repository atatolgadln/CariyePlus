const { Command } = require('@sapphire/framework');
const { EmbedBuilder, MessageFlags } = require('discord.js');
const fetch = require('node-superfetch');

class NumberCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'number',
			description: 'get a random fact about a number',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('number')
				.setDescription('get a random fact about a number')
				.addIntegerOption((option) =>
					option
						.setName('number')
						.setDescription('the number that u wanna learn')
						.setRequired(true),
				),
		);
	}

	async chatInputRun(interaction) {
		const number = interaction.options.getInteger('number');

		const { body } = await fetch
			.get(`http://numbersapi.com/${number}`)
			.catch(() => {
				return interaction.reply({ content: 'I could not find any information about that number.', flags: MessageFlags.Ephemeral });
			});
		if (!body) return;

		const em = new EmbedBuilder()
			.setDescription(body.toString())
			.setColor('Random');
		return interaction.reply({ embeds: [em] });
	}
}

module.exports = {
	NumberCommand,
};