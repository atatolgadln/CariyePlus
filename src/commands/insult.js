const { Command } = require('@sapphire/framework');
const fetch = require('node-fetch');

class InsultCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'insult',
			description: 'insult someone',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('insult')
				.setDescription('insult someone')
				.addUserOption((option) =>
					option
						.setName('target')
						.setDescription('The user to insult')
						.setRequired(true),
				),
		);
	}

	async chatInputRun(interaction) {
		const insult = await fetch('https://evilinsult.com/generate_insult.php?lang=en&type=json').then(r => r.json());

		const text = `${interaction.options.getMember('target').user.username}, ${insult.insult}`;

		await interaction.reply({ content: text });
	}
}

module.exports = {
	InsultCommand,
};