const { Command } = require('@sapphire/framework');
const { EmbedBuilder, MessageFlags } = require('discord.js');

class EmojiListCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'emojiList',
			description: 'get the emoji list of the guild',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('emojilist')
				.setDescription('get the emoji list of the guild '),
		);
	}

	async chatInputRun(interaction) {
		if (!await interaction.guild.emojis.fetch()) {
			return interaction.reply({
				content: 'Something went wrong - No emojis found',
				flags: MessageFlags.Ephemeral,
			});
		}

		const embed = new EmbedBuilder()
			.setTitle('Emoji List')
			.setColor('Random')
			.setDescription(`${(await interaction.guild.emojis.fetch()).map(e => `${e} - \`${e}\``).join('\n')}`);

		return interaction.reply({
			embeds: [embed],
		});
	}
}

module.exports = {
	EmojiListCommand,
};