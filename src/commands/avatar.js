const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

class AvatarCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'avatar',
			description: 'get user\'s avatar',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('avatar')
				.setDescription('get avatar')
				.addUserOption((option) =>
					option
						.setName('tag')
						.setDescription('tag whose avatar you want to know')
						.setRequired(false),
				),
		);
	}

	async chatInputRun(interaction) {
		const y = interaction.options.getMember('tag') || interaction.member;

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
	AvatarCommand,
};