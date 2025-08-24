const { Command } = require('@sapphire/framework');
const badges = require('../structures/badge/index');

class BadgeCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'badge',
			description: 'shows member badge(s)',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('badge')
				.setDescription('shows member badge(s)')
				.addUserOption((option) =>
					option
						.setName('member')
						.setDescription('select member if you want')
						.setRequired(false),
				),
		);
	}

	async chatInputRun(interaction) {
		const { client } = this.container;
		const b = interaction.options.getMember('member');
		const c = b || interaction.member;
		const a = client.users.cache.get(c.id);
		badges
			.badges(a)
			.then((response) => {
				let result = '';
				for (let i = 0; i < response.length; i++) {
					result += `**${response[i].name} - ** ${response[i].url}\n`;
				}
				return interaction.reply({
					content: result ? result : b ? `${b.user.username} dont have any badges...` : 'you dont have no badges..',
				});
			});
	}
}
module.exports = {
	BadgeCommand,
};