const { Command } = require('@sapphire/framework');
const { EmbedBuilder, MessageFlags } = require('discord.js');
const axios = require('axios');

class MemeCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'meme',
			description: 'sends epic memes',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('meme')
				.setDescription('sends epic memes'),
		);
	}

	async chatInputRun(interaction) {
		try {
			const response = await axios.get('https://www.reddit.com/r/memes/top.json?limit=100&t=week');

			if (response.data && response.data[0] && response.data[0].data.children[0].data) {
				const memeData = response.data[0].data.children[0].data;
				const { url, title, ups, num_comments } = memeData;

				const embed = new EmbedBuilder()
					.setColor('Random')
					.setTitle(title)
					.setURL(`https://www.reddit.com${memeData.permalink}`)
					.setImage(url)
					.setFooter({ text: `👍 ${ups}  |  💬 ${num_comments || 0}` });

				return interaction.reply({ embeds: [embed] });
			}
			else {
				return interaction.reply({ content: 'Failed to fetch a meme. Try again later.', flags: MessageFlags.Ephemeral });
			}
		}
		catch (error) {
			console.log(error);
			return interaction.reply({ content: 'There was an error getting the meme from axios!', flags: MessageFlags.Ephemeral });
		}
	}
}

module.exports = {
	MemeCommand,
};