const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const { Color } = require('coloras');

class ColorCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'color',
			description: 'sends random color',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('color')
				.setDescription('sends random color'),
		);
	}

	async chatInputRun(interaction) {
		const random = new Color();

		const embed = new EmbedBuilder()
			.setAuthor({ name: `Random Color for ${interaction.member.user.username}` })
			.setColor(random.toHex())
			.addFields([
				{ name: 'HEX', value: random.toHex(), inline: true },
				{ name: 'RGB', value: random.toRgb(), inline: true },
				{ name: 'HSL', value: random.toHsl(), inline: true },
				{ name: 'HSV', value: random.toHsv(), inline: true },
				{ name: 'CMYK', value: random.toCmyk(), inline: true },
			])
			.setImage(random.imageUrl);

		return interaction.reply({
			embeds: [embed],
		});
	}
}

module.exports = {
	ColorCommand,
};