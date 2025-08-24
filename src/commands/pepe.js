const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

class PepeCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'pepe',
			description: 'pepeeeeeeeeeeeeeee',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('pepe')
				.setDescription('pepeeeeeeeeeeeeeee'),
		);
	}

	async chatInputRun(interaction) {
		const images = ['https://cdn.discordapp.com/emojis/428556352915505165.png?v=1', 'https://cdn.discordapp.com/emojis/428556326482739230.png?v=1', 'https://cdn.discordapp.com/emojis/428556486235389973.png?v=1', 'https://cdn.discordapp.com/emojis/428556308929576960.png?v=1', 'https://cdn.discordapp.com/emojis/428556295218659329.png?v=1', 'https://cdn.discordapp.com/emojis/428556467021545473.png?v=1', 'https://cdn.discordapp.com/emojis/428556448507625474.png?v=1', 'https://cdn.discordapp.com/emojis/428556377754042378.png?v=1', 'https://cdn.discordapp.com/emojis/428556281767526405.png?v=1', 'https://cdn.discordapp.com/emojis/428556266366042112.png?v=1', 'https://cdn.discordapp.com/emojis/851850143867207762.png?v=1', 'https://cdn.discordapp.com/emojis/832138595942924318.png?v=1', 'https://cdn.discordapp.com/emojis/832138714406191155.gif?v=1', 'https://cdn.discordapp.com/emojis/657672938887053347.png?v=1', 'https://cdn.discordapp.com/emojis/796681055041224724.gif?v=1', 'https://cdn.discordapp.com/emojis/794102617449562133.png?v=1', 'https://cdn.discordapp.com/emojis/874264253660553216.gif?v=1', 'https://cdn.discordapp.com/emojis/853314854226886657.gif?v=1', 'https://cdn.discordapp.com/emojis/850333611759501342.gif?v=1', 'https://cdn.discordapp.com/emojis/840153748290142208.gif?v=1', 'https://cdn.discordapp.com/emojis/853314866512003112.gif?v=1', 'https://cdn.discordapp.com/emojis/818884015331213355.png?v=1', 'https://cdn.discordapp.com/emojis/818883948695257108.png?v=1', 'https://cdn.discordapp.com/emojis/853314839635296258.gif?v=1', 'https://cdn.discordapp.com/emojis/818883937622294548.png?v=1', 'https://cdn.discordapp.com/emojis/808977252309532742.png?v=1', 'https://cdn.discordapp.com/emojis/808977252309532742.png?v=1', 'https://cdn.discordapp.com/emojis/818883973911806004.png?v=1'];
		const image = images[Math.floor(Math.random() * images.length)];
		const pepe = new EmbedBuilder()
			.setTitle('PEPEEEEEEEEEEEE')
			.setImage(image)
			.setColor('Random');

		return interaction.reply({ embeds: [pepe] });
	}
}

module.exports = {
	PepeCommand,
};