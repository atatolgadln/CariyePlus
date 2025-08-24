const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

class AdviceCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'advice',
			description: 'gives u an advice',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName('advice').setDescription('gives u an advice'),
		);
	}

	async chatInputRun(interaction) {
		const buff = await axios.get('https://api.adviceslip.com/advice');
		const embed = new EmbedBuilder()
			.setDescription(`${buff.data.slip.advice}`)
			.setColor('Random');
		return interaction.reply({ embeds: [embed] });
	}
}
module.exports = {
	AdviceCommand,
};