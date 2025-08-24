const { Listener } = require('@sapphire/framework');
const Schema = require('../models/welcomeSchema.js');
const { EmbedBuilder } = require('discord.js');

class WelcomeEvent extends Listener {
	constructor(context, options = {}) {
		super(context, {
			...options,
			once: false,
			event: 'guildMemberAdd',
		});
	}

	async run(member) {
		try {
			Schema.findOne({ Guild: member.guild.id }, async (e, data) => {
				if (!data) return;
				if (data.Channel === '0') return;

				const channel = member.guild.channels.cache.get(data.Channel);
				const welcome = new EmbedBuilder()
					.setAuthor({
						name: `${member.user.username} Welcome to the ${member.guild.name}`,
						iconUrl: member.user.displayAvatarURL({ dynamic: true }) || '',
					})
					.setColor('Random')
					.setDescription(data.WMessage)
					.setThumbnail('https://media1.giphy.com/media/l4JyOCNEfXvVYEqB2/giphy.gif')
					.setTimestamp();

				channel.send({ embeds: [welcome] });
			});
		}
		catch (e) {
			console.log(e);
			member.channel.send({ content: 'Error', ephemeral: true });
		}
	}
}

module.exports = {
	WelcomeEvent,
};