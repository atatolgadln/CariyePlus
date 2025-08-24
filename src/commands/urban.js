const { Command } = require('@sapphire/framework');
const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, MessageFlags } = require('discord.js');

class UrbanCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'urban',
			description: 'Urban Dictionary Search',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('urban')
				.setDescription('Urban Dictionary Search')
				.addStringOption((option) =>
					option
						.setName('word')
						.setDescription('Please write something to search on Urban Dictionary')
						.setRequired(true),
				),
		);
	}

	async chatInputRun(interaction) {
		const w = interaction.options.getString('word');
		const urban = require('urban'),
			u = urban(w);

		u.first(function(json) {
			if (!json) {
				return interaction.reply({ content: 'This word doesn\'t exist', flags: MessageFlags.Ephemeral });
			}
			else {
				const definition = json.definition;
				const link = json.permalink;
				const ex = json.example;
				const tup = json.thumbs_up;
				const tdown = json.thumbs_down;

				const e = new EmbedBuilder()
					.setTitle('Urban Dictionary')
					.setColor('Random')
					.setThumbnail('https://i.imgur.com/ALGVUh7.png')
					.addFields([
						{ name: 'Definition', value: definition },
						{ name: 'Example', value: ex },
					])
					.setFooter({
						text: `👍: ${tup} | 👎: ${tdown}`,
					});

				const row = new ActionRowBuilder().addComponents([
					new ButtonBuilder()
						.setLabel('See on page')
						.setEmoji('🌐')
						.setURL(link)
						.setStyle(ButtonStyle.Link),
				]);

				return interaction.reply({
					embeds: [e],
					components: [row],
				});
			}
		});
	}
}

module.exports = {
	UrbanCommand,
};