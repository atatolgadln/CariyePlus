const { Listener } = require('@sapphire/framework');
const { AutoPoster } = require('topgg-autoposter');
const { ActivityType } = require('discord.js');
const play = require('play-dl');

class ReadyEvent extends Listener {
	constructor(context, options) {
		super(context, {
			...options,
			once: true,
			name: 'ready',
			event: 'clientReady',
		});
	}

	async run(client) {

		let users = 0;
		for (const guild of [...client.guilds.cache.values()]) users += guild.memberCount;

		console.log([
			`${client.user.tag} is ready!`,
			'',
			`Servers: ${client.guilds.cache.size}`,
			`Users: ${users}`,
		].join('\n'));


		play.authorization();

		setInterval(() => {
			const statuses = [
				'have a lovely day',
				`with ${users} users`,
				`in ${client.guilds.cache.size} servers`,
				'ready for all commands',
				'/help',
				'Hi! I need ur support on Top.gg',
				'with other bots if u say they better than me',
			];
			const statuss = statuses[Math.floor(Math.random() * statuses.length)];
			let type;
			if (statuss == 'have a lovely day') type = ActivityType.Custom;
			if (statuss == `with ${users} users`) type = ActivityType.Playing;
			if (statuss == `in ${client.guilds.cache.size} servers`) type = ActivityType.Playing;
			if (statuss == 'Ready for all commands') type = ActivityType.Custom;
			if (statuss == '/help') type = ActivityType.Custom;
			if (statuss == 'Hi! I need ur support on Top.gg') type = ActivityType.Custom;
			if (statuss == 'with other bots if u say they better than me') type = ActivityType.Competing;
			client.user.setActivity(statuss, { type: type });
		}, 125000);

		let i = 0;
		const names = [
			'C',
			'Ca',
			'Car',
			'Cari',
			'Cariy',
			'Cariye',
			'Cariye+',
		];

		async function changeNickname() {
			const nextNickname = names[i];

			i++;

			if (i === names.length) {
				i = 0;
			}

			const guild = client.guilds.cache.get('593049830880837634');
			const botMember = guild.members.cache.get('849663572308918343');
			await botMember.setNickname(nextNickname);
		}


		setInterval(changeNickname, 60000);

		setInterval(() => {
			AutoPoster(process.env.topgg, client);
		}, 300000);
	}
}

module.exports = {
	ReadyEvent,
};