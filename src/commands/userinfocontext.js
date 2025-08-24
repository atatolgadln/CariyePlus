const { Command } = require('@sapphire/framework');
const { ApplicationCommandType, EmbedBuilder, time } = require('discord.js');

class UserInfoContextCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'User Info',
			description: 'Check users info',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerContextMenuCommand((builder) =>
			builder
				.setName('User Info')
				.setType(ApplicationCommandType.User),
		);
	}

	async contextMenuRun(interaction) {
		const a = interaction.targetMember;
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
	UserInfoContextCommand,
};