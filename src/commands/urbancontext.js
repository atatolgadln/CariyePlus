const { Command } = require('@sapphire/framework');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandType, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = class UrbanContext extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'Urban Dictionary',
			description: 'Urban Dictionary Search',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerContextMenuCommand((builder) =>
			builder
				.setName('Urban Dictionary')
				.setType(ApplicationCommandType.Message),
		);
	}

	async contextMenuRun(interaction) {
		const w = interaction.targetMessage.content;
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
};