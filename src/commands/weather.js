const { Command } = require('@sapphire/framework');
const { EmbedBuilder, MessageFlags } = require('discord.js');
const weather = require('weather-js');

class WeatherCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'weather',
			description: 'Shows the weather for a specific location',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('weather')
				.setDescription('Shows the weather for the place from celcius')
				.addStringOption((option) =>
					option
						.setName('location')
						.setDescription('location name')
						.setRequired(true),
				),
		);
	}

	async chatInputRun(interaction) {
		const location = interaction.options.getString('location');

		await weather.find({ search: location, degreeType: 'C' }, function(err, result) {
			try {
				const e = new EmbedBuilder()
					.setTitle(`Weather in ${result[0].location.name.toString()}`)
					.setThumbnail(result[0].current.imageURL)
					.setColor('Random')
					.addFields([
						{ name: 'Date', value: result[0].current.date.toString() },
						{ name: 'Weather Event', value: result[0].current.skytext.toString() },
						{ name: 'Temperature', value: result[0].current.temperature.toString() },
						{ name: 'Feeling Temperature', value: result[0].current.feelslike.toString() },
						{ name: 'Humidity', value: result[0].current.humidity.toString() },
						{ name: 'Wind Speed', value: result[0].current.windspeed.toString() },
					]);

				return interaction.reply({ embeds: [e] });
			}
			catch (err) {
				return interaction.reply({
					content: 'Oh no! There is an error that occurred. Please try again after a few seconds.',
					flags: MessageFlags.Ephemeral,
				});
			}
		});
	}
}

module.exports = {
	WeatherCommand,
};