const { Subcommand } = require('@sapphire/plugin-subcommands');
const { EmbedBuilder, MessageFlags, ChannelType } = require('discord.js');
const ms = require('ms');
require('moment-duration-format');

module.exports = class SlowmodeCommands extends Subcommand {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'slowmode',
			description: 'enable or disable slowmode for channel',
			subcommands: [
				{
					name: 'disable',
					chatInputRun: 'chatInputDisable',
				},
				{
					name: 'enable',
					chatInputRun: 'chatInputEnable',
				},
			],
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('slowmode')
				.setDescription('enable or disable slowmode for channel')
				.addSubcommand((command) =>
					command
						.setName('disable')
						.setDescription('disable slowmode for channel')
						.addChannelOption((option) =>
							option
								.setName('channel')
								.setDescription('select channel to disable slowmode')
								.addChannelTypes(ChannelType.GuildText)
								.setRequired(false),
						),
				)
				.addSubcommand((command) =>
					command
						.setName('enable')
						.setDescription('enable slowmode for channel')
						.addStringOption((option) =>
							option
								.setName('time')
								.setDescription('time units - h(our), m(inute), s(econds) example: 1h 2m 3s or 2m etc.')
								.setRequired(true),
						)
						.addChannelOption((option) =>
							option
								.setName('channel')
								.setDescription('select channel to enable slowmode')
								.addChannelTypes(ChannelType.GuildText)
								.setRequired(false),
						)
						.addStringOption((option) =>
							option
								.setName('reason')
								.setDescription('reason for enabling slowmode')
								.setRequired(false),
						),
				),
		);
	}

	async chatInputDisable(interaction) {
		const chan1 = interaction.options.getChannel('channel') || interaction.channel;
		const currentSlowmode1 = chan1.rateLimitPerUser;

		if (currentSlowmode1 === 0) {
			const slowmodeOfferror = new EmbedBuilder()
				.setDescription('Slowmode is already off')
				.setColor('Random');

			return interaction.reply({
				embeds: [slowmodeOfferror],
				flags: MessageFlags.Ephemeral,
			});
		}
		chan1.setRateLimitPerUser(0, `${chan1.name}'s slowmode is disabled`);

		return interaction.reply({
			content: 'Slowmode Disabled',
			flags: MessageFlags.Ephemeral,
		});
	}

	async chatInputEnable(interaction) {
		const chan = interaction.options.getChannel('channel') || interaction.channel;
		const currentSlowmode = chan.rateLimitPerUser;
		const reason = interaction.options.getString('reason') || 'Not Specified';
		const a = interaction.options.getString('time');
		const time = ms(a) / 1000;

		const slowmodeError3 = new EmbedBuilder()
			.setDescription('This is not a valid time. Please write the time in the units mentioned. \n\n Time Units - h(hour), m(minute), s(seconds) \n (Example - /slowmode 5s)')
			.setColor('Random');
		if (isNaN(time)) {
			return interaction.reply({
				embeds: [slowmodeError3],
				flags: MessageFlags.Ephemeral,
			});
		}

		if (time > 21600000) {
			return interaction.reply({
				content: 'Time is too high. Make sure it is below 6 hours.',
				flags: MessageFlags.Ephemeral,
			});
		}

		if (currentSlowmode === time) {
			return interaction.reply({
				content: `Slowmode is already set to ${a}`,
				flags: MessageFlags.Ephemeral,
			});
		}

		await chan.setRateLimitPerUser(time, reason);
		const afterSlowmode = chan.rateLimitPerUser;
		if (afterSlowmode > 0) {
			const embed = new EmbedBuilder()
				.setTitle('Slowmode Enabled')
				.addFields([
					{ name: 'Slowmode Duration', value: a },
					{ name: 'Reason', value: reason },
				])
				.setColor('Random');

			return interaction.reply({
				embeds: [embed],
			});
		}
		else if (afterSlowmode === 0) {
			return interaction.reply({
				embeds: [slowmodeError3],
				flags: MessageFlags.Ephemeral,
			});
		}
	}
};