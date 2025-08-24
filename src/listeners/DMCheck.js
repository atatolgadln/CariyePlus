const { Listener } = require('@sapphire/framework');

class DMCheckEvent extends Listener {
	constructor(context, options) {
		super(context, {
			...options,
			once: false,
			event: 'messageCreate',
		});
	}

	async run(message) {
		if (message.guild) return;
		const a = message.client.channels.cache.get('833993567688196099');
		if (message.author.bot) return;
		await a.send(`**New DM Received** \n**By** - ${message.author.username}-${message.author} \n**Message** - ${message.content}`);

		return;
	}
}

module.exports = {
	DMCheckEvent,
};