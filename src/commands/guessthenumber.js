const { Command } = require('@sapphire/framework');
const { InteractionCollector, EmbedBuilder } = require('discord.js');

class GuessTheNumber extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'guessthenumber',
			description: 'Guess the number in 30 seconds',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('guessthenumber')
				.setDescription('Guess the number in 30seconds'),
		);
	}

	async chatInputRun(interaction) {
		const numberToGuess = Math.floor(Math.random() * 100) + 1;
		let isGuessed = false;
		let timeLeft = 30;

		const embed = new EmbedBuilder()
			.setColor('Random')
			.setTitle('Guess the Number Game')
			.setDescription('Guess a number between 1 and 100')
			.addFields({ name: 'Time Remaining', value: `${timeLeft} seconds` })
			.setFooter({ text: 'Good luck!' });

		await interaction.reply({ embeds: [embed] });

		const filter = response => {
			return !isNaN(response.content) && response.author.id === interaction.user.id;
		};

		const collector = new InteractionCollector(interaction.client, { interaction, time: 30000, filter });

		const interval = setInterval(() => {
			if (timeLeft > 0 && !isGuessed) {
				timeLeft--;
				embed.spliceFields(0, 1, { name: 'Time Remaining', value: `${timeLeft} seconds` });
				interaction.editReply({ embeds: [embed] });
			}
			else {
				clearInterval(interval);
			}
		}, 1000);

		collector.on('collect', async i => {
			if (i.isMessage()) {
				const guess = parseInt(i.content);
				if (guess === numberToGuess) {
					isGuessed = true;
					clearInterval(interval);
					embed.setColor(0x00ff00)
						.setDescription(`Congratulations! You guessed the number ${numberToGuess}!`)
						.spliceFields(0, 1, { name: 'Result', value: 'You won!' });
					await interaction.editReply({ embeds: [embed] });
					collector.stop();
				}
				else {
					await interaction.followUp(guess < numberToGuess ? 'Too low!' : 'Too high!');
				}
			}
		});

		collector.on('end', () => {
			if (!isGuessed) {
				embed.setColor(0xff0000)
					.setDescription(`Time's up! The number was ${numberToGuess}.`)
					.spliceFields(0, 1, { name: 'Result', value: 'Time expired!' });
				interaction.editReply({ embeds: [embed] });
			}
		});
	}
}

module.exports = {
	GuessTheNumber,
};