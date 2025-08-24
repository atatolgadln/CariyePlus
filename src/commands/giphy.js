const { Command } = require('@sapphire/framework');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const giphy = require('giphy-api')('W8g6R14C0hpH6ZMon9HV9FTqKs4o4rCk');

class GiphyCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'giphy',
			description: 'search gifs on giphy',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('giphy')
				.setDescription('search gifs on giphy')
				.addStringOption((option) =>
					option
						.setName('text')
						.setDescription('search gifs')
						.setRequired(true),
				),
		);
	}

	async chatInputRun(interaction) {
		const text = interaction.options.getString('text');

		await giphy.search(text).then(function(res) {
			const id = res.data[0].id;
			const msgurl = `https://media.giphy.com/media/${id}/giphy.gif`;

			const e = new EmbedBuilder()
				.addField('Search Term', text.toString(), true)
				.setImage(msgurl)
				.setColor('Random')
				.setTimestamp()
				.setFooter({
					text: 'Powered by Giphy',
					iconURL: 'https://raw.githubusercontent.com/Giphy/GiphyAPI/f68a8f1663f29dd9e8e4ea728421eb2977e42d83/api_giphy_logo_sparkle_clear.gif',
				});

			const row = new ActionRowBuilder().addComponents([
				new ButtonBuilder()
					.setLabel('Page URL')
					.setURL(`https://giphy.com/search/${text}`)
					.setStyle(ButtonStyle.Link),
			]);

			return interaction.reply({
				embeds: [e],
				components: [row],
			});
		});
	}
}

module.exports = {
	GiphyCommand,
};