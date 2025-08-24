const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

class BannerCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'banner',
			description: 'get member banner',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('banner')
				.setDescription('get member banner')
				.addUserOption((option) =>
					option
						.setName('user')
						.setDescription('Select user')
						.setRequired(true),
				),
		);
	}

	async chatInputRun(interaction) {
		const target = interaction.options.getUser('user') ;

		let receive = '';
		let banner =
      'https://cdn.discordapp.com/attachments/829722741288337428/834016013678673950/banner_invisible.gif';

		const res = await fetch(`https://discord.com/api/v8/users/${target.id}`, {
			method: 'GET',
			headers: {
				Authorization: `Bot ${process.env.token}`,
			},
		});

		if (res.status !== 404) {
			const json = await res.json();
			receive = json['banner'];
		}

		if (receive) {
			const res2 = await fetch(
				`https://cdn.discordapp.com/banners/${target.id}/${receive}.gif`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bot ${process.env.token}`,
					},
				},
			);

			banner = `https://cdn.discordapp.com/banners/${target.id}/${receive}.gif?size=4096`;
			if (res2.status === 415) {
				banner = `https://cdn.discordapp.com/banners/${target.id}/${receive}.png?size=4096`;
			}
		}
		else {
			return interaction.reply({
				content: 'Couldn\'t find any profile banner set up!',
				ephemeral: true,
			});
		}

		const bannerEmbed = new EmbedBuilder()
			.setColor('Random')
			.setAuthor({
				name: `${target.user.username}'s Profile Banner`,
			})
			.setImage(banner);

		return interaction.reply({
			embeds: [bannerEmbed],
		});
	}
}

module.exports = {
	BannerCommand,
};