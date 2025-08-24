const { Subcommand } = require('@sapphire/plugin-subcommands');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

module.exports = class BotCommands extends Subcommand {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'bot',
			description: 'bot subcommand -> info, help, and ping commands',
			subcommands: [
				{
					name: 'donation',
					chatInputRun: 'chatInputDonation',
				},
				{
					name: 'help',
					chatInputRun: 'chatInputHelp',
				},
				{
					name: 'info',
					chatInputRun: 'chatInputInfo',
				},
				{
					name: 'ping',
					chatInputRun: 'chatInputPing',
				},
				{
					name: 'vote',
					chatInputRun: 'chatInputVote',
				},
			],
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('bot')
				.setDescription('bot subcommand -> info, help, and ping commands')
				.addSubcommand((command) =>
					command
						.setName('donation')
						.setDescription('wanna donation link? here it is'),
				)
				.addSubcommand((command) =>
					command
						.setName('help')
						.setDescription('need help?'),
				)
				.addSubcommand((command) =>
					command
						.setName('info')
						.setDescription('shows bot info'),
				)
				.addSubcommand((command) =>
					command
						.setName('ping')
						.setDescription('check the bots latency'),
				)
				.addSubcommand((command) =>
					command
						.setName('vote')
						.setDescription('wanna help me to grow, thanks a bunch!'),
				),
		);
	}

	async chatInputDonation(interaction) {
		const row = new ActionRowBuilder().addComponents([
			new ButtonBuilder()
				.setLabel('Donate by Patreon')
				.setURL('https://patreon.com/cariyeplus?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink')
				.setStyle(ButtonStyle.Link),
		]);

		return interaction.reply({
			components: [row],
		});
	}

	async chatInputHelp(interaction) {
		const commands = [...this.container.stores.get('commands').values()];

		const embed = new EmbedBuilder()
			.setTitle('All commands are in here')
			.setColor('Random')
			.setDescription(commands.map((cmd) => `\`${cmd.name}\`` + ': ' + cmd.description).join('\n'));

		const row = new ActionRowBuilder().addComponents([
			new ButtonBuilder()
				.setLabel('Support Server / Our Community')
				.setURL('https://discord.gg/J4wDA93rjd')
				.setStyle(ButtonStyle.Link),

			new ButtonBuilder()
				.setLabel('Support Me by Donation')
				.setURL('https://patreon.com/cariyeplus/membership')
				.setStyle(ButtonStyle.Link),
		]);

		await interaction.reply({
			embeds: [embed],
			components: [row],
			flags: MessageFlags.Ephemeral,
		});
	}

	async chatInputInfo(interaction) {
		const { client } = this.container;
		const ping = Date.now() - interaction.createdAt;
		let users = 0;
		for (const guild of [...client.guilds.cache.values()]) users += guild.memberCount;

		const duration = moment
			.duration(client.uptime)
			.format(' D [days], H [hours], m [minutes], s [seconds]');

		const embed = new EmbedBuilder()
			.setAuthor({ name: 'Cariye+\'s Info', iconURL: client.user.avatarURL({ format: 'png' }) })
			.setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 4096 }))
			.setColor('Random')
			.addFields([
				{ name: 'About Me', value: `\n:man_technologist: **Developer:**\n whattyu | <@496328012741214208>\n\n :robot: **My Name:**\n Cariye+\n\n :id: **ID:**\n 849663572308918343\n\n **Servers and Users:**\n In ${client.guilds.cache.size} servers with ${users} users` },
				{ name: 'Technical Info', value: `\n**OS**\n ${process.platform.toUpperCase()}\n\n **Memory Usage**\n ${Math.floor((process.memoryUsage().heapUsed / 1024) / 1024)} MB\n\n **Status**\n :white_check_mark: I will always be online`, inline: true },
				{ name: 'Ping and Uptime', value: `\n**WS Ping**\n ${Math.floor(client.ws.ping)}ms\n\n **Bot Ping**\n ${ping}ms \n\n**Uptime**\n ${duration}`, inline: true },
				{ name: 'Versions', value: `\n**Discord.js Version**\n v14.15.3\n\n **Node.js Version**\n ${process.version}`, inline: true },
			])
			.setTimestamp()
			.setFooter({ text: interaction.member.user.username, iconURL: interaction.member.user.avatarURL({ format:'png' }) });

		const row = new ActionRowBuilder().addComponents([
			new ButtonBuilder()
				.setLabel('Invite me')
				.setURL('https://discord.com/api/oauth2/authorize?client_id=849663572308918343&permissions=8&scope=bot%20applications.commands')
				.setStyle(ButtonStyle.Link),

			new ButtonBuilder()
				.setLabel('Support Server')
				.setURL('https://discord.gg/J4wDA93rjd')
				.setStyle(ButtonStyle.Link),

			new ButtonBuilder()
				.setLabel('View on Top.gg')
				.setURL('https://top.gg/bot/849663572308918343')
				.setStyle(ButtonStyle.Link),
		]);

		return interaction.reply({
			embeds: [embed],
			components: [row],
		});
	}

	async chatInputPing(interaction) {
		const { client } = this.container;
		const ping =
        Date.now() - interaction.createdAt;
		return interaction.reply({
			content: `**My Ping:** **\`${ping}ms\`**\n**WS Ping:** **\`${client.ws.ping}ms\`**`,
			flags: MessageFlags.Ephemeral,
		});
	}

	async chatInputVote(interaction) {
		const row = new ActionRowBuilder().addComponents([
			new ButtonBuilder()
				.setLabel('Top.gg')
				.setURL('https://top.gg/bot/849663572308918343')
				.setStyle(ButtonStyle.Link),

			new ButtonBuilder()
				.setLabel('Discord Bot List')
				.setURL('https://discordbotlist.com/bots/cariye-2270')
				.setStyle(ButtonStyle.Link),

			new ButtonBuilder()
				.setLabel('Void Bots List')
				.setURL('https://voidbots.net/bot/849663572308918343/')
				.setStyle(ButtonStyle.Link),
		]);

		return interaction.reply({
			components: [row],
		});
	}
};