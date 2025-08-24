const { Command } = require('@sapphire/framework');
const { EmbedBuilder, MessageFlags } = require('discord.js');
const warnSchema = require('../models/warnSchema.js');

class UnwarnCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'unwarn',
			description: 'Unwarn a user',
			requiredUserPermissions: ['BanMembers', 'Administrator', 'ModerateMembers'],
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('unwarn')
				.setDescription('Unwarn a user')
				.addUserOption((option) =>
					option
						.setName('user')
						.setDescription('Select user')
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName('id')
						.setDescription('type warn id (see in warnings)')
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
		const id = interaction.options.getString('id');
		const reason = interaction.options.getString('reason') || 'No reason provided';
		const warnID = parseInt(id);

		const warnDoc = await warnSchema
			.findOne({
				guildID: interaction.guild.id,
				memberID: a.id,
			})
			.catch((err) => console.log(err));

		if (!warnDoc || !warnDoc.warnings.length) {
			const unwarnError3 = new EmbedBuilder()
				.setDescription(`${a} does not have any warnings`)
				.setColor('Random');
			return interaction.reply({
				embeds: [unwarnError3],
				flags: MessageFlags.Ephemeral,
			});
		}

		if (warnID <= 0 || warnID > warnDoc.warnings.length) {
			const unwarnError4 = new EmbedBuilder()
				.setDescription('This is an invalid warning ID. \n To check warn ID, use /listwarnings')
				.setColor('Random');
			return interaction.reply({
				embeds: [unwarnError4],
				flags: MessageFlags.Ephemeral,
			});
		}

		warnDoc.warnings.splice(warnID - 1, warnID !== 1 ? warnID - 1 : 1);

		await warnDoc.save().catch((err) => console.log(err));

		const embed = new EmbedBuilder()
			.setDescription(`Unwarned ${a} \n **Reason:** ${reason}`)
			.setColor('Random');

		return interaction.reply({
			embeds: [embed],
		});
	}
}

module.exports = {
	UnwarnCommand,
};