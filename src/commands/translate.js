const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

class TranslateCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'translate',
			description: 'translate sentences/words',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('translate')
				.setDescription('translate sentences/words')
				.addStringOption((option) =>
					option
						.setName('tolang')
						.setDescription('what language do you want to translate')
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName('input')
						.setDescription('text write something to translate')
						.setRequired(true),
				),
		);
	}

	async chatInputRun(interaction) {
		const input = interaction.options.getString('input');
		const language = interaction.options.getString('tolang');

		const res = await fetch(`https://luminabot.xyz/api/json/translate?text=${encodeURIComponent(input)}&tolang=${encodeURIComponent(language)}`);
		const response = res.json();

		const embed = new EmbedBuilder()
			.setTitle('Translator')
			.addFields(
				{ name: 'Input', value: response.input },
				{ name: 'Language', value: response.toLang },
				{ name: 'Output', value: response.translated },
			)
			.setColor('Random')
			.setThumbnail(response.image);

		return interaction.reply({ embeds: [embed] });
	}
}

module.exports = {
	TranslateCommand,
};