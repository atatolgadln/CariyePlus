const { Command } = require('@sapphire/framework');
const { PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags } = require('discord.js');

class BanCommand extends Command {
	constructor(context, options) {
		super(context,
			{ ...options,
				name: 'ban',
				description: 'ban members',
				requiredUserPermissions: [PermissionFlagsBits.BanMembers],
				requiredClientPermissions: [PermissionFlagsBits.BanMembers],
			},
		);
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('ban')
				.setDescription('ban members')
				.addUserOption((option) =>
					option
						.setName('user')
						.setDescription('Select user')
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName('reason')
						.setDescription('provide a reason if u want')
						.setRequired(false),
				),
		);
	}

	async chatInputRun(interaction) {
		const a = interaction.options.getUser('user').member ;
		const re = interaction.options.getString('reason') || 'No reason provided';

		if (interaction.member.user.id === a.user.id) {
			return interaction.reply({
				content: 'You cannot ban **yourself**.',
				flags: MessageFlags.Ephemeral,
			});
		}

		if (a.user.id === interaction.client.user.id) {
			return interaction.reply({
				content: 'I cannot ban **myself**',
				flags: MessageFlags.Ephemeral,
			});
		}

		if (interaction.member.roles.highest.position <= a.roles.highest.position) {
			return interaction.reply({
				content: 'You cannot ban the person because you are trying to ban who has **same** or **high** permission as yours.',
				flags: MessageFlags.Ephemeral,
			});
		}

		if (a.bannable == false) {
			return interaction.reply({
				content: 'It is **not possible** to ban who the person you are trying to ban.',
				flags: MessageFlags.Ephemeral,
			});
		}

		const embed = new EmbedBuilder()
			.setTitle(`${a.user.username} is Banning Please Confirm!`)
			.setThumbnail(a.user.avatarURL())
			.setDescription(`Reason: ${re || 'No reason provided'}`)
			.setColor('Random')
			.setTimestamp()
			.setFooter({
				text: `Judge: ${interaction.member.user.username}`,
				iconURL: interaction.member.user.avatarURL(),
			});

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('confirm_ban')
					.setLabel('Confirm')
					.setStyle(ButtonStyle.Danger),
				new ButtonBuilder()
					.setCustomId('cancel_ban')
					.setLabel('Cancel')
					.setStyle(ButtonStyle.Secondary),
			);

		await interaction.reply({
			embeds: [embed],
			components: [row],
		});

		const filter = (i) => {
			return ['confirm_ban', 'cancel_ban'].includes(i.customId) && i.user.id === interaction.user.id;
		};

		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

		collector.on('collect', async i => {
			if (i.customId === 'confirm_ban') {
				await handleConfirmBan(interaction, i, a, re, interaction.guild);
			}
			else if (i.customId === 'cancel_ban') {
				await handleCancelBan(interaction, i, a);
			}
		});

		collector.on('end', collected => {
			if (collected.size === 0) {
				interaction.editReply({ content: 'No response. Ban cancelled.', embeds: [], components: [] });
			}
		});
	}
}

async function handleConfirmBan(interaction, i, a, re, guild) {
	try {
		const confirmationEmbed = new EmbedBuilder()
			.setColor('Random')
			.setTitle('Ban Successful')
			.setThumbnail('https://media.giphy.com/media/l3V0j3ytFyGHqiV7W/giphy.gif')
			.setDescription(`Mission 'Kick-${a.user.username}' has been successful.`)
			.addFields({ name: 'Reason', value: re })
			.setTimestamp()
			.setFooter({ text: `Banned by ${i.user.username}`, iconURL: i.user.avatarURL() });

		await interaction.editReply({ embeds: [confirmationEmbed], components: [] });
		await guild.members.ban(a, `Banned by ${i.user.username}: ${re}`);
	}
	catch (error) {
		console.error(error);
		const errorEmbed = new EmbedBuilder()
			.setColor('#ff0000')
			.setTitle('Ban Failed')
			.setDescription(`Mission 'Kick-${a.user.username}' has been failed.`)
			.setTimestamp()
			.setFooter({ text: 'An error occurred', iconURL: i.user.avatarURL() });

		await interaction.editReply({ embeds: [errorEmbed], components: [] });
	}
}

async function handleCancelBan(interaction, i, a) {
	const cancelEmbed = new EmbedBuilder()
		.setColor('#ffff00')
		.setTitle('Ban Cancelled')
		.setDescription(`Mission 'Ban-${a.user.username}' has been cancelled.`)
		.setTimestamp()
		.setFooter({ text: `Cancelled by ${i.user.username}`, iconURL: i.user.avatarURL() });

	await interaction.editReply({ embeds: [cancelEmbed], components: [] });
}

module.exports = {
	BanCommand,
};