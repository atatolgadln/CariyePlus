const { Command } = require('@sapphire/framework');
const { EmbedBuilder, MessageFlags } = require('discord.js');
const warnSchema = require('../models/warnSchema.js');

class WarnCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'warn',
			description: 'Warn a user',
			requiredUserPermissions: ['BanMembers', 'Administrator', 'ModerateMembers'],
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('warn')
				.setDescription('Warn a user')
				.addUserOption((option) =>
					option
						.setName('user')
						.setDescription('Select user')
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName('reason')
						.setDescription('provide a reason (not necessary)')
						.setRequired(false),
				),
		);
	}

	async chatInputRun(interaction) {
		const a = interaction.options.getMember('user');
		const re = interaction.options.getString('reason') || 'No reason provided';

		if (interaction.member.user.id === a.user.id) {
			return interaction.reply({
				content: 'You cannot warn **yourself**.',
				flags: MessageFlags.Ephemeral,
			});
		}

		if (interaction.member.roles.highest.position <= a.roles.highest.position) {
			return interaction.reply({
				content: 'You cannot warn the person because you are trying to warn has **same** or **high** authority as yours.',
				flags: MessageFlags.Ephemeral,
			});
		}

		let warnDoc = await warnSchema
			.findOne({
				guildID: interaction.guild.id,
				memberID: a.id,
			})
			.catch((err) => console.log(err));

		if (!warnDoc) {
			warnDoc = new warnSchema({
				guildID: interaction.guild.id,
				memberID: a.id,
				warnings: [re],
				moderator: [interaction.member.id],
				date: [Math.round(interaction.createdTimestamp / 1000)],
			});

			await warnDoc.save().catch((err) => console.log(err));
			return interaction.reply({ content: `**Successfully Warned ${a}**` });
		}
		else {
			if (warnDoc.warnings.length >= 3) {
				return interaction.reply({
					content: 'This member has already been warned 3 times, use ban command to ban this user from this guild or use unwarn to remove the warnings from this user',
					flags: MessageFlags.Ephemeral,
				});
			}

			warnDoc.warnings.push(re);
			warnDoc.moderator.push(interaction.member.id);
			warnDoc.date.push(Math.round(interaction.createdTimestamp / 1000));

			await warnDoc.save().catch((err) => console.log(err));

			const embed = new EmbedBuilder()
				.setDescription(`Warned **${a}** \n Reason: **${re}**`)
				.setColor('Random')
				.setFooter({
					text: `Judge: ${interaction.member.user.username}`,
				});

			return interaction.reply({
				embeds: [embed],
			});
		}
	}
}

module.exports = {
	WarnCommand,
};