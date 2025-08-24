const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const warnSchema = require('../models/warnSchema.js');

module.exports = class ListWarningsContext extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'listwarnings',
			description: 'List all warnings for a user',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('listwarnings')
				.setDescription('List all warnings for a user')
				.addUserOption((option) =>
					option.setName('user')
						.setDescription('The user to list warnings for')
						.setRequired(true),
				),
		);
	}

	async chatInputRun(interaction) {
		const a = interaction.options.getMember('user');

		const warnDoc = await warnSchema
			.findOne({
				guildID: interaction.guild.id,
				memberID: a.id || a.client.id,
			})
			.catch((err) => console.log(err));

		if (!warnDoc || !warnDoc.warnings.length) {
			return interaction.reply({
				content: `${a} has no warnings`,
				ephemeral: true,
			});
		}

		const data = [];

		for (let i = 0; warnDoc.warnings.length > i; i++) {
			data.push(`**ID:** ${i + 1}`);
			data.push(`**Reason:** ${warnDoc.warnings[i]}`);
			data.push(
				`**Moderator:** ${await interaction.client.users
					.fetch(warnDoc.moderator[i])
					.catch(() => 'Deleted User')}`,
			);
			data.push(
				`**Date:** ${'<t:' + warnDoc.date[i] + ':F>'}\n`,
			);
		}

		const embed = new EmbedBuilder()
			.setAuthor({
				name: a.user.username || a.client.user.username,
				iconURL: a.displayAvatarURL({ dynamic: false }),
			})
			.setColor('Random')
			.setDescription(data.join('\n'));

		return interaction.reply({
			embeds: [embed],
		});
	}
};