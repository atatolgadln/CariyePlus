const { Command } = require('@sapphire/framework');
const { PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandType, EmbedBuilder, MessageFlags } = require('discord.js');

class kickContext extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'Kick Member',
			description: 'Kick a member',
			requiredUserPermissions: [PermissionFlagsBits.KickMembers],
			requiredClientPermissions: [PermissionFlagsBits.KickMembers],
		});
	}

	registerApplicationCommands(registry) {
		registry.registerContextMenuCommand((builder) =>
			builder
				.setName('Kick Member')
				.setType(ApplicationCommandType.User),
		);
	}

	async contextMenuRun(interaction) {
		const a = interaction.targetMember;

		if (interaction.member.user.id === a.user.id) {
			return interaction.reply({
				content: 'You cannot kick **yourself**.',
				flags: MessageFlags.Ephemeral,
			});
		}

		if (a.user.id === interaction.client.user.id) {
			return interaction.reply({
				content: 'I cannot kick **myself**',
				flags: MessageFlags.Ephemeral,
			});
		}

		if (interaction.member.roles.highest.position <= a.roles.highest.position) {
			return interaction.reply({
				content: 'You cannot kick the person because you are trying to kick who has **same** or **high** permission as yours.',
				flags: MessageFlags.Ephemeral,
			});
		}

		if (a.bannable == false) {
			return interaction.reply({
				content: 'It is **not possible** to kick who the person you are trying to kick.',
				flags: MessageFlags.Ephemeral,
			});
		}

		const embed = new EmbedBuilder()
			.setTitle(`${a.user.username} is Kicking Please Confirm!`)
			.setThumbnail(a.user.avatarURL())
			.setColor('Random')
			.setTimestamp()
			.setFooter({
				text: `Judge: ${interaction.member.user.username}`,
				iconURL: interaction.member.user.avatarURL(),
			});

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('confirm_kick')
					.setLabel('Confirm')
					.setStyle(ButtonStyle.Danger),
				new ButtonBuilder()
					.setCustomId('cancel_kick')
					.setLabel('Cancel')
					.setStyle(ButtonStyle.Secondary),
			);

		await interaction.reply({
			embeds: [embed],
			components: [row],
		});

		const filter = (i) => {
			return ['confirm_kick', 'cancel_kick'].includes(i.customId) && i.user.id === interaction.user.id;
		};

		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

		collector.on('collect', async i => {
			if (i.customId === 'confirm_kick') {
				await handleConfirmKick(interaction, i, a, interaction.guild);
			}
			else if (i.customId === 'cancel_kick') {
				await handleCancelKick(interaction, i, a);
			}
		});

		collector.on('end', collected => {
			if (collected.size === 0) {
				interaction.editReply({ content: 'No response. Kick cancelled.', embeds: [], components: [] });
			}
		});
	}
}

async function handleConfirmKick(interaction, i, a, guild) {
	try {
		const confirmationEmbed = new EmbedBuilder()
			.setColor('Random')
			.setTitle('Kick Successful')
			.setThumbnail('https://media.giphy.com/media/l3V0j3ytFyGHqiV7W/giphy.gif')
			.setDescription(`Mission 'Kick-${a.user.username}' has been succussful.`)
			.setTimestamp()
			.setFooter({ text: `Kicked by ${i.user.username}`, iconURL: i.user.avatarURL() });

		await interaction.editReply({ embeds: [confirmationEmbed], components: [] });
		await guild.members.ban(a, `Kicked by ${i.user.username}`);
	}
	catch (error) {
		console.error(error);
		const errorEmbed = new EmbedBuilder()
			.setColor('#ff0000')
			.setTitle('Ban Failed')
			.setDescription(`Mission 'Ban-${a.user.username}' has been failed.`)
			.setTimestamp()
			.setFooter({ text: 'An error occurred', iconURL: i.user.avatarURL() });

		await interaction.editReply({ embeds: [errorEmbed], components: [] });
	}
}

async function handleCancelKick(interaction, i, a) {
	const cancelEmbed = new EmbedBuilder()
		.setColor('#ffff00')
		.setTitle('Ban Cancelled')
		.setDescription(`Mission 'Ban-${a.user.username}' has been cancelled.`)
		.setTimestamp()
		.setFooter({ text: `Cancelled by ${i.user.username}`, iconURL: i.user.avatarURL() });

	await interaction.editReply({ embeds: [cancelEmbed], components: [] });
}

module.exports = {
	kickContext,
};