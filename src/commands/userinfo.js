const { Command } = require('@sapphire/framework');
const { EmbedBuilder, time } = require('discord.js');

class UserInfoCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'userinfo',
			description: 'Check user information',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('userinfo')
				.setDescription('Check users info')
				.addUserOption((option) =>
					option
						.setName('user')
						.setDescription('select user')
						.setRequired(false),
				),
		);
	}

	async chatInputRun(interaction) {
		const a = interaction.options.getMember('user') || interaction.member;
		const color = a.displayHexColor == true ? a.displayHexColor : 'Random';

		const embed = new EmbedBuilder()
			.setAuthor({
				name: a.user.tag.toString(),
				iconURL: a.user.displayAvatarURL({ dynamic: true }),
			})
			.addFields([
				{ name: 'Username', value: a.user.username.toString(), inline: true },
				{ name: 'Discriminator', value: `#${a.user.discriminator.toString()}`, inline: true },
				{ name: 'Nickname', value: a.nickname || 'none', inline: true },
				{ name: 'Highest Role', value: a.roles.highest.toString(), inline: true },
				{ name: `Roles List [${a.roles.cache.size}]`, value: a.roles.cache.map(r => r).join(', '), inline: true },
				{ name: 'Flags', value: a.user?.flags?.toArray().toString() || 'no flags', inline: true },
				{ name: 'Timeout', value: a.user.isCommunicationDisabled ? a.user.communicationDisabledUntil : '❌', inline: true },
				{ name: 'Joined At', value: time(a.joinedAt, 'R') },
				{ name: 'Created At', value: time(a.user.createdAt, 'F') },
			])
			.setColor(color)
			.setThumbnail(a.user.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 }))
			.setTimestamp();

		return interaction.reply({
			embeds: [embed],
		});
	}
}

module.exports = {
	UserInfoCommand,
};