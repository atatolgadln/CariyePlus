const { Command } = require('@sapphire/framework');
const { ApplicationCommandType, EmbedBuilder } = require('discord.js');

class AvatarContext extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'Avatar Context',
			description: 'Get user\'s avatar',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerContextMenuCommand((builder) =>
			builder
				.setName('AvatarContext')
				.setType(ApplicationCommandType.User),
		);
	}

	async contextMenuRun(interaction) {
		const y = interaction.targetMember;

		const e = new EmbedBuilder()
			.setTitle(`${y.user.username}'s Avatar`)
			.setURL(y.user.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 }))
			.setColor('Random')
			.setImage(y.user.displayAvatarURL({ dynamic: true, size: 4096, format: 'png' }));

		return interaction.reply({
			embeds: [e],
		});
	}
}
module.exports = {
	AvatarContext,
};