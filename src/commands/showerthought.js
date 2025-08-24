const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

class STCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'showerthought',
			description: 'Get a random shower thought',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('showerthought')
				.setDescription('Get a random shower thought'),
		);
	}

	async chatInputRun(interaction) {
		const data = await fetch('https://www.reddit.com/r/Showerthoughts/top.json?limit=100&t=week').then(r => r.json());
		const posts = data.data.children;
		const randomPost = posts[Math.floor(Math.random() * posts.length)].data;

		const e = new EmbedBuilder()
			.setTitle('💭 Random Showerthought')
			.setDescription(randomPost.title)
			.setURL(`https://reddit.com${randomPost.permalink}`)
			.setFooter({ text: `👍 ${randomPost.ups} | 💬 ${randomPost.num_comments}` })
			.setColor('Random');

		await interaction.reply({ embeds: [e] });
	}
}

module.exports = {
	STCommand,
};