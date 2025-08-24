const { Listener } = require('@sapphire/framework');
const Schema = require('../models/levelSchema.js');
const Levels = require('discord-xp');
Levels.setURL(process.env.mongodb_uri);


class LevelEvent extends Listener {
	constructor(context, options) {
		super(context, {
			...options,
			once: false,
			event: 'messageCreate',
		});
	}

	async run(message) {
		try {
			Schema.findOne({ Guild: message.guild.id }, async (e, data) => {
				if (!data) return;
				if (!message.guild) return;
				if (message.author.bot) return;
				if (data.Channel === '0') return;

				const randomAmountOfXp = Math.floor(Math.random() * 24) + 1;
				const hasLeveledUp = await Levels.appendXp(
					message.author.id,
					message.guild.id,
					randomAmountOfXp,
				);
				if (hasLeveledUp) {
					const user = await Levels.fetch(message.author.id, message.guild.id);
					// const member = message.mentions.users.first() || message.author
					const channel = message.guild.channels.cache.get(data.Channel);
					channel.send(
						`${message.author}, congratulations! :tada::tada: You Just Leveled Up \n ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ \n Your Current Level Is  **${user.level}**. :tada: \n  ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ \n Keep Chatting For Leveling Up :tada::tada: \n ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ `,
					);
				}
			});
		}
		catch (e) {
			console.log(e);
			message.channel.send(e);
		}
	}
}

module.exports = {
	LevelEvent,
};