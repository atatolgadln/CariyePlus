const { Subcommand } = require('@sapphire/plugin-subcommands');
const { EmbedBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const Schema = require('../models/levelSchema.js');
const WSchema = require('../models/welcomeSchema.js');
const Star = require('../models/stars.js');

module.exports = class BotCommands extends Subcommand {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'config',
			description: 'bot subcommand -> info, help, and ping commands',
			requiredUserPermissions: [PermissionFlagsBits.BanMembers],
			requiredClientPermissions: [PermissionFlagsBits.BanMembers],
			subcommands: [
				{
					name: 'check',
					type: 'group',
					entries: [
						{
							name: 'level',
							chatInputRun: 'chatInputLevelCheck',
						},
						{
							name: 'starboard',
							chatInputRun: 'chatInputStarboardCheck',
						},
						{
							name: 'welcome',
							chatInputRun: 'chatInputWelcomeCheck',
						},
					],
				},
				{
					name: 'set',
					type: 'group',
					entries: [
						{
							name: 'level',
							chatInputRun: 'chatInputLevelSet',
						},
						{
							name: 'starboard',
							chatInputRun: 'chatInputStarboardSet',
						},
						{
							name: 'welcome',
							chatInputRun: 'chatInputWelcomeSet',
						},
					],
				},
				{
					name: 'disable',
					type: 'group',
					entries: [
						{
							name: 'level',
							chatInputRun: 'chatInputLevelDisable',
						},
						{
							name: 'starboard',
							chatInputRun: 'chatInputStarboardDisable',
						},
						{
							name: 'welcome',
							chatInputRun: 'chatInputWelcomeDisable',
						},
					],
				},
			],
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('config')
				.setDescription('config your chatbot channel, level channel and disable welcome event or set welcome channel')
				.addSubcommandGroup((group) =>
					group
						.setName('check')
						.setDescription('check the systems')
						.addSubcommand((command) =>
							command
								.setName('level')
								.setDescription('check level channel'),
						)
						.addSubcommand((command) =>
							command
								.setName('starboard')
								.setDescription('check starboard channel'),
						)
						.addSubcommand((command) =>
							command
								.setName('welcome')
								.setDescription('check welcome channel'),
						),
				)
				.addSubcommandGroup((group) =>
					group
						.setName('set')
						.setDescription('set chat bot, level channel and welcome channel')
						.addSubcommand((command) =>
							command
								.setName('level')
								.setDescription('set level channel')
								.addChannelOption((option) =>
									option
										.setName('channel')
										.setDescription('Select channel')
										.setRequired(true),
								),
						)
						.addSubcommand((command) =>
							command
								.setName('starboard')
								.setDescription('set starboard channel')
								.addChannelOption((option) =>
									option
										.setName('channel')
										.setDescription('Select channel')
										.setRequired(true),
								),
						)
						.addSubcommand((command) =>
							command
								.setName('welcome')
								.setDescription('set welcome system')
								.addStringOption((option) =>
									option
										.setName('welcomemessage')
										.setDescription('Welcome message')
										.setRequired(true),
								)
								.addChannelOption((option) =>
									option
										.setName('goodbyemessage')
										.setDescription('Goodbye message')
										.setRequired(true),
								)
								.addChannelOption((option) =>
									option
										.setName('channel')
										.setDescription('Select channel')
										.setRequired(true),
								),
						),
				)
				.addSubcommandGroup((group) =>
					group
						.setName('disable')
						.setDescription('disable the systems')
						.addSubcommand((command) =>
							command
								.setName('level')
								.setDescription('disable level system'),
						)
						.addSubcommand((command) =>
							command
								.setName('starboard')
								.setDescription('disable starboard'),
						)
						.addSubcommand((command) =>
							command
								.setName('welcome')
								.setDescription('disable welcome system'),
						),
				),
		);
	}

	async chatInputLevelCheck(interaction) {
		Schema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
			if (err) {
				console.log(err);
				return interaction.reply({ content: 'An error occurred', flags: MessageFlags.Ephemeral });
			}
			if (!data) return interaction.reply({ content: 'No data found', flags: MessageFlags.Ephemeral });

			if (data.Channel === '0') {
				return interaction.reply({ content: 'Level System is disabled', flags: MessageFlags.Ephemeral });
			}
			else {
				return interaction.reply({ content: `Level channel is -> <#${data.Channel}>` });
			}
		});
	}

	async chatInputStarboardCheck(interaction) {
		Star.findOne({ Guild: interaction.guild.id }, async (err, data) => {
			if (err) {
				console.log(err);
				return interaction.reply({ content: 'An error occurred', flags: MessageFlags.Ephemeral });
			}
			if (!data) return interaction.reply({ content: 'No data found', flags: MessageFlags.Ephemeral });

			if (data.Channel === '0') {
				return interaction.reply({ content: 'Starboard is disabled', flags: MessageFlags.Ephemeral });
			}
			else {
				return interaction.reply({ content: `Starboard channel is -> <#${data.Channel}>` });
			}
		});
	}

	async chatInputWelcomeCheck(interaction) {
		WSchema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
			if (err) {
				console.log(err);
				return interaction.reply({ content: 'An error occurred', flags: MessageFlags.Ephemeral });
			}
			if (!data) return interaction.reply({ content: 'No data found', flags: MessageFlags.Ephemeral });

			if (data.Channel === '0') {
				return interaction.reply({ content: 'Welcome System is disabled', flags: MessageFlags.Ephemeral });
			}
			else {
				const welcome = new EmbedBuilder()
					.setColor('Random')
					.setTitle('Welcome System')
					.setDescription(`Welcome Channel:\n> <#${data.Channel}>\n\nWelcome Message:\n> ${data.WMessage}\n\nGoodbye Message:\n> ${data.BMessage}`);
				return interaction.reply({ embeds: [welcome] });
			}
		});
	}

	async chatInputLevelSet(interaction) {
		const channel = interaction.options.getChannel('channel');

		Schema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
			if (err) {
				console.log(err);
				return interaction.reply({ content: 'An error occurred', flags: MessageFlags.Ephemeral });
			}
			if (data) {
				data.Channel = channel.id;
				data.save();
			}
			else {
				new Schema({
					Guild: interaction.guild.id,
					Channel: channel.id,
				}).save();
			}

			const levelup = new EmbedBuilder()
				.setColor('Random')
				.setTitle('Level-Up Channel')
				.setDescription(`${channel} has been set as a Level-Up Channel`);

			await interaction.reply({ content: 'Level channel is successfully setted', flags: MessageFlags.Ephemeral });
			await channel.send({ embeds: [levelup] });
		});
	}

	async chatInputStarboardSet(interaction) {
		const channel = interaction.options.getChannel('channel');

		Star.findOne({ Guild: interaction.guild.id }, async (err, data) => {
			if (err) {
				console.log(err);
				return interaction.reply({ content: 'An error occurred', flags: MessageFlags.Ephemeral });
			}
			if (data) {
				data.Channel = channel.id;
				data.save();
			}
			else {
				new Star({
					Guild: interaction.guild.id,
					Channel: channel.id,
				}).save();
			}

			const starboard = new EmbedBuilder()
				.setColor('Random')
				.setTitle('Starboard Channel')
				.setDescription(`${channel} has been set as a Starboard Channel`);

			await interaction.reply({ content: 'Starboard channel is successfully setted', flags: MessageFlags.Ephemeral });
			await channel.send({ embeds: [starboard] });
		});
	}

	async chatInputWelcomeSet(interaction) {
		const channel = interaction.options.getChannel('channel');
		const welcomemessage = interaction.options.getString('welcomemessage');
		const byemessage = interaction.options.getString('goodbyemessage');

		WSchema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
			if (err) {
				console.log(err);
				return interaction.reply({ content: 'An error occurred', flags: MessageFlags.Ephemeral });
			}
			if (data) {
				data.Channel = channel.id;
				data.WMessage = welcomemessage;
				data.BMessage = byemessage;
				data.save();
			}
			else {
				new WSchema({
					Guild: interaction.guild.id,
					Channel: channel.id,
					WMessage: welcomemessage,
					BMessage: byemessage,
				}).save();
			}

			const welcome = new EmbedBuilder()
				.setColor('Random')
				.setTitle('Welcome Channel')
				.setDescription(`${channel} has been set as a Welcome Channel\n Welcome Message:\n> ${welcomemessage}\n\n Goodbye Message:\n> ${byemessage}`);

			await interaction.reply({ content: 'Welcome channel is successfully setted', flags: MessageFlags.Ephemeral });
			await channel.send({ embeds: [welcome] });
		});
	}

	async chatInputLevelDisable(interaction) {
		Schema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
			if (err) {
				console.log(err);
				return interaction.reply({ content: 'An error occurred', flags: MessageFlags.Ephemeral });
			}
			if (!data.Channel) return interaction.reply({ content: 'Level System isn\'t setuped' });
			if (data.Channel === '0') return interaction.reply({ content: 'Level System already disabled' });
			if (data) {
				data.Channel = '0';
				data.save();
			}
			else {
				new Schema({
					Guild: interaction.guild.id,
					Channel: '0',
				}).save();
			}

			return interaction.reply({ content: 'Level channel is successfully disabled', flags: MessageFlags.Ephemeral });
		});
	}

	async chatInputStarboardDisable(interaction) {
		Star.findOne({ Guild: interaction.guild.id }, async (err, data) => {
			if (err) {
				console.log(err);
				return interaction.reply({ content: 'An error occurred', flags: MessageFlags.Ephemeral });
			}
			if (!data.Channel) return interaction.reply({ content: 'Starboard System isn\'t setuped' });
			if (data.Channel === '0') return interaction.reply({ content: 'Starboard System already disabled' });
			if (data) {
				data.Channel = '0';
				data.save();
			}
			else {
				new Star({
					Guild: interaction.guild.id,
					Channel: '0',
				}).save();
			}

			return interaction.reply({ content: 'Starboard channel is successfully disabled', flags: MessageFlags.Ephemeral });
		});
	}

	async chatInputWelcomeDisable(interaction) {
		WSchema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
			if (err) {
				console.log(err);
				return interaction.reply({ content: 'An error occurred', flags: MessageFlags.Ephemeral });
			}
			if (!data.Channel) return interaction.reply({ content: 'Welcome System isn\'t setuped' });
			if (data.Channel === '0') return interaction.reply({ content: 'Welcome System already disabled' });
			if (data) {
				data.Channel = '0';
				data.save();
			}
			else {
				new WSchema({
					Guild: interaction.guild.id,
					Channel: '0',
				}).save();
			}

			return interaction.reply({ content: 'Welcome channel is successfully disabled', flags: MessageFlags.Ephemeral });
		});
	}
};