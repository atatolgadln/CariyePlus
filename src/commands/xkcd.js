const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

class XKCDCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'xkcd',
			description: 'Get a random XKCD comic',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('xkcd')
				.setDescription('Get a random XKCD comic'),
		);
	}

	async chatInputRun(interaction) {
		const latest = await fetch('https://xkcd.com/info.0.json').then(r => r.json());
		const maxNum = latest.num;
		const randNum = Math.floor(Math.random() * maxNum) + 1;
		const comic = await fetch(`https://xkcd.com/${randNum}/info.0.json`).then(r => r.json());

		const e = new EmbedBuilder()
			.setTitle(comic.title)
			.setAuthor({ name: `Comic #${comic.num}`, url: `https://xkcd.com/${comic.num}/` })
			.setImage(comic.img);

		await interaction.reply({ embeds: [e] });
	}
}

module.exports = {
	XKCDCommand,
};