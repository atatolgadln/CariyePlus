const { Command } = require('@sapphire/framework');
const akinator = require('../structures/akinator.js');
const { MessageFlags } = require('discord.js');

class AkinatorCommand extends Command {
	constructor(context, options) {
		super(context, { ...options });
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName('akinator').setDescription('Starts a game of Akinator'),
		);
	}

	async chatInputRun(interaction) {
		interaction.reply({ content: 'Attempted to start a game of Akinator.', flags: MessageFlags.Ephemeral });
		akinator(interaction);
	}
}
module.exports = {
	AkinatorCommand,
};