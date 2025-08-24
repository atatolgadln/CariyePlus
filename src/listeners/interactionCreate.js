const { Listener } = require('@sapphire/framework');
const yts = require('yt-search');
const { InteractionType } = require('discord.js');

class interactionCreateEvent extends Listener {
	constructor(context, options) {
		super(context, {
			...options,
			once: false,
			event: 'interactionCreate',
		});
	}

	async run(interaction) {
		if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
			const query = interaction.options.getString('query', true);
			const r = await yts(query || 'Never gonna give you up');
			const videos = r.videos.slice(0, 15);
			/* videos.forEach(function(v) {
				const views = String(v.views).padStart(10, ' ');
				console.log(`${ views } | ${ v.title } (${ v.timestamp }) | ${ v.author.name }`);
			}); */

			interaction.editReply(
				videos.forEach(function(v) {
					return {
						name: v.title,
						value: v.url,
					};
				}),
			);
		}
	}
}

module.exports = {
	interactionCreateEvent,
};