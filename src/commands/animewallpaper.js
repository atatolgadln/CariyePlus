const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

class AnimeWallpaperCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'animewallpaper',
			description: 'random anime wallpapers',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('animewallpaper')
				.setDescription('random anime wallpapers'),
		);
	}

	async chatInputRun(interaction) {
		const embed = new EmbedBuilder()
			.setColor('Random')
			.setImage(await 'https://pic.re/images')
			.setTitle('Anime Wallpapers');

		return interaction.reply({
			embeds: [embed],
		});
	}
}
module.exports = {
	AnimeWallpaperCommand,
};