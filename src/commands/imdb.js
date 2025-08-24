const { Command } = require('@sapphire/framework');
const { EmbedBuilder, MessageFlags } = require('discord.js');
const imdb = require('imdb-api');
const x = new imdb.Client({ apiKey: process.env.imdb });

class IMDBCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'imdb',
			description: 'Get the information about series and movie',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('imdb')
				.setDescription('Get the information about series and movie')
				.addStringOption((option) =>
					option
						.setName('moviename')
						.setDescription('text the movie name')
						.setRequired(true),
				),
		);
	}

	async chatInputRun(interaction) {
		const moviename = interaction.options.getString('moviename');
		let movie;
		try {
			movie = await x.get({ name: moviename });
		}
		catch (error) {
			console.error(error);
			return interaction.reply({ content: 'Movie not found or an error occurred.', flags: MessageFlags.Ephemeral });
		}

		if (!movie || !movie.title) {
			return interaction.reply({ content: 'I could not find the movie.', flags: MessageFlags.Ephemeral });
		}

		const embed = new EmbedBuilder()
			.setTitle(movie.title || 'Unknown Title')
			.setColor('Random')
			.setThumbnail(movie.poster || null)
			.setDescription(movie.plot || 'No plot available.')
			.addFields([
				{ name: 'Country', value: movie.country || 'Unknown', inline: true },
				{ name: 'Languages', value: movie.languages || 'Unknown', inline: true },
				{ name: 'Type', value: movie.type || 'Unknown', inline: true },
			])
			.setFooter({ text: `Ratings: ${movie.rating || 'N/A'}` });

		return interaction.reply({
			embeds: [embed],
		});
	}
}

module.exports = {
	IMDBCommand,
};