const { Command } = require('@sapphire/framework');
const blackjack = require('../structures/blackjack/bindex');

class BlackjackCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'blackjack',
			description: 'are you feeling lucky?',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName('blackjack').setDescription('are you feeling lucky?'),
		);
	}

	async chatInputRun(interaction) {
		blackjack(interaction);
	}
}
module.exports = {
	BlackjackCommand,
};