const { Command } = require('@sapphire/framework');
const { EmbedBuilder, MessageFlags } = require('discord.js');

class SuggestionCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'suggestion',
			description: 'suggestion to the creator for me',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('suggestion')
				.setDescription('suggestion to the creator for me')
				.addStringOption((option) =>
					option
						.setName('suggestion')
						.setDescription('your suggestion')
						.setRequired(true),
				),
		);
	}

	async chatInputRun(interaction) {
		const tguild = interaction.client.guilds.cache.get('833993567688196096');
		const tchannel = tguild.channels.cache.get('833993567688196099');
		const text = interaction.options.getString('suggestion');

		const embed = new EmbedBuilder()
			.setTitle('Suggestion')
			.setAuthor({ name: interaction.member.user.username, iconURL: interaction.member.user.avatarURL({ format: 'png' }) })
			.setDescription(text)
			.setColor('Random');

		await tchannel.send({ embeds: [embed] });

		return interaction.reply({
			content: 'I send your suggestion to my creator',
			flags: MessageFlags.Ephemeral,
		});
	}
}

module.exports = {
	SuggestionCommand,
};