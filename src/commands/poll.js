const { Command } = require('@sapphire/framework');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const ms = require('ms');

class PollCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'poll',
			description: 'Create a poll',
			preconditions: ['GuildOnly', 'ManageGuild'],
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('poll')
				.setDescription('Create a poll')
				.addStringOption((option) =>
					option
						.setName('question')
						.setDescription('The question to ask')
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName('answera')
						.setDescription('The first answer')
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName('answerb')
						.setDescription('The second answer')
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName('time')
						.setDescription('The duration of the poll')
						.setRequired(true),
				),
		);
	}

	async chatInputRun(interaction) {
		const question = interaction.options.getString('question');
		const answera = interaction.options.getString('answera');
		const answerb = interaction.options.getString('answerb');
		const time = ms(interaction.options.getString('time')) / 1000;

		const time_ = ms(time, { long: true });
		let votes_a = 0;
		let votes_b = 0;
		const alreadyvoted = [];
		const a = new Date();

		const buttons1 = new ActionRowBuilder().addComponents([
			new ButtonBuilder()
				.setLabel(`${answera}`)
				.setCustomId('a')
				.setStyle('PRIMARY'),

			new ButtonBuilder()
				.setLabel(`${answerb}`)
				.setCustomId('b')
				.setStyle('PRIMARY'),
		]);

		await interaction.reply({ content: 'Poll created!', flags: MessageFlags.Ephemeral });

		const embed = new EmbedBuilder()
			.setTitle('New Poll')
			.setDescription('If you want to vote, click on the desired button.')
			.addField('Question', question)
			.setFooter(`The poll will end in, ${time_}`)
			.setTimestamp(a)
			.setColor('RANDOM');

		const msg = await interaction.followUp({
			embeds: [embed],
			components: [buttons1],
			fetchReply: true,
		});

		const filter = (btn) => btn.message.id === msg.id;
		const collector = msg.createMessageComponentCollector({ filter, time });

		collector.on('collect', async (btn) => {
			if (alreadyvoted.includes(btn.user.id)) {
				const embed4 = new EmbedBuilder()
					.setTitle('You already voted!')
					.setColor('RED');
				btn.reply({ embeds: [embed4], flags: MessageFlags.Ephemeral });
			}
			else if (btn.customId === 'a') {
				++votes_a;
				alreadyvoted.push(btn.user.id);
				const embed2 = new EmbedBuilder()
					.setTitle('Poll')
					.addField('Question', question, true)
					.setColor('RANDOM')
					.setDescription(`**${answera}**: ${votes_a} votes\n**${answerb}**: ${votes_b} votes`)
					.setFooter(`The poll will end in, ${time_}`);
				msg.edit({
					embeds: [embed2],
				});
				btn.reply({ content: `You voted **${answera}**`, flags: MessageFlags.Ephemeral });
			}
			else if (btn.customId === 'b') {
				++votes_b;
				alreadyvoted.push(btn.user.id);
				const embed2 = new EmbedBuilder()
					.setTitle('Poll')
					.addField('Question', question, true)
					.setColor('RANDOM')
					.setDescription(`**${answera}**: ${votes_a} votes\n**${answerb}**: ${votes_b} votes`)
					.setFooter(`The poll will end in, ${time_}`);
				msg.edit({
					embeds: [embed2],
				});
				btn.reply({ content: `You voted **${answerb}**`, flags: MessageFlags.Ephemeral });
			}
		});

		collector.on('end', async () => {
			const embed3 = new EmbedBuilder()
				.setTitle('This poll has ended!')
				.addField('Question', question, true)
				.setColor('DARK_RED')
				.setDescription(`**Results**:\n**${answera}**: ${votes_a} votes\n**${answerb}**: ${votes_b} votes`);
			const buttons2 = new ActionRowBuilder().addComponents([
				new ButtonBuilder()
					.setLabel('Ended!')
					.setCustomId('ended')
					.setStyle('DANGER')
					.setDisabled(true),
			]);
			msg.edit({
				embeds: [embed3],
				components: [buttons2],
			});
		});
	}
}

module.exports = {
	PollCommand,
};