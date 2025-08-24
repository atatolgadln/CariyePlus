const { Command } = require('@sapphire/framework');

class HackCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'hack',
			description: 'hack member ofc not for real',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('hack')
				.setDescription('hack member ofc not for real')
				.addUserOption((option) =>
					option
						.setName('member')
						.setDescription('g member if u want')
						.setRequired(false),
				),
		);
	}

	async chatInputRun(interaction) {
		const hackedMember = interaction.options.getUser('text') || interaction.member;

		const hackedMesasges = [
			`Hacking ${hackedMember.user.username} now...`,
			'[▖] Finding discord login... (2fa bypassed)',

			`[▘] Found:
      Email: ${hackedMember.user.username + hackedMember.id.slice(13)}@gmail.com
      Token: ${Buffer.from(hackedMember.id + hackedMember.id.slice(6)).toString('base64')}`,

			`[▖] Injecting trojan virus into discriminator #${hackedMember.user.discriminator}`,
			'[▘] Finding IP address',
			`[▝] IP address: 127.0.0.1:${Math.floor(Math.random() * 999) + 100}`,
			'[▗] Reporting account to discord for breaking ToS...',
		];

		let count = 0;

		await interaction.reply(hackedMesasges[count++]);

		const interval = setInterval(() => {
			if (count == hackedMesasges.length) {
				interaction.editReply(`[▖] Finished hacking ${hackedMember.user.username}`);
				clearInterval(interval);
				return;
			}

			interaction.editReply(hackedMesasges[count++]);
		}, 3000);
	}
}

module.exports = {
	HackCommand,
};