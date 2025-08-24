const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

class BanlistCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'banlist',
			description: 'get ban list',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('banlist')
				.setDescription('get ban list'),
		);
	}

	async chatInputRun(interaction) {
		interaction.guild.bans.fetch()
			.then(banned => {
				let list = banned.map(ban => '`' + ban.user.tag + '`').join('\n');

				if (list.length >= 1950) list = `${list.slice(0, 1947)}...`;

				const embed = new EmbedBuilder()
					.setTitle('Ban List')
					.setDescription(list)
					.setColor('Random')
					.setTimestamp();

				return interaction.reply({
					embeds: [embed],
				});
			});
	}
}

module.exports = {
	BanlistCommand,
};