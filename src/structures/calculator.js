const math = require('mathjs');
const Discord = require('discord.js');
const functions = require('./functions.js');

module.exports = async (options) => {
	if (!options.interaction) {
		throw new Error('Sudo Error: message argument was not specified.');
	}
	if (typeof options.interaction !== 'object') {
		throw new TypeError('Sudo Error: Invalid Discord Message was provided.');
	}

	if (!options.embed) options.embed = {};

	options.embed.title = 'Calculator';
	options.disabledQuery = 'Calculator is disabled!';
	options.invalidQuery = 'The provided equation is invalid!';
	options.othersMessage = 'Only <@{{author}}> can use the buttons!';

	await options.interaction.deferReply();

	const authorId = options.member.id;

	let str = ' ';
	let stringify = '```\n' + str + '\n```';

	const row = [];
	const rows = [];

	const button = new Array([], [], [], [], []);
	const buttons = new Array([], [], [], [], []);

	const text = [
		'(',
		')',
		'^',
		'%',
		'AC',
		'7',
		'8',
		'9',
		'÷',
		'DC',
		'4',
		'5',
		'6',
		'x',
		'⌫',
		'1',
		'2',
		'3',
		'-',
		'\u200b',
		'.',
		'0',
		'=',
		'+',
		'\u200b',
	];

	let cur = 0;
	let current = 0;

	for (let i = 0; i < text.length; i++) {
		if (button[current].length === 5) current++;
		button[current].push(
			functions.createButton(text[i], false, functions.getRandomID),
		);
		if (i === text.length - 1) {
			for (const btn of button) row.push(functions.addRow(btn));
		}
	}

	const embed = new Discord.EmbedBuilder()
		.setTitle(options.embed.title)
		.setDescription(stringify)
		.setColor('Random')
		.setFooter(options.embed.footer);
	if (options.embed.timestamp) {
		embed.setTimestamp();
	}

	const msg =
		options.message instanceof Discord.Interaction
			? await options.message.editReply({ embeds: [embed], components: row })
			: await options.message.reply({ embeds: [embed], components: row });

	async function edit() {
		const _embed = new Discord.EmbedBuilder()
			.setTitle(options.embed.title)
			.setDescription(stringify)
			.setColor('Random')
			.setFooter(options.embed.footer);
		if (options.embed.timestamp) {
			_embed.setTimestamp();
		}
		msg.edit({
			embeds: [_embed],
			components: row,
		});
	}

	async function lock() {
		const _embed = new Discord.EmbedBuilder()
			.setTitle(options.embed.title)
			.setColor('Random')
			.setDescription(stringify)
			.setFooter(options.embed.footer);
		if (options.embed.timestamp) {
			_embed.setTimestamp();
		}
		for (let i = 0; i < text.length; i++) {
			if (buttons[cur].length === 5) cur++;
			buttons[cur].push(
				functions.createButton(text[i], true, functions.getRandomID),
			);
			if (i === text.length - 1) {
				for (const btn of buttons) rows.push(functions.addRow(btn));
			}
		}

		msg.edit({
			embeds: [_embed],
			components: rows,
		});
	}

	const calc = msg.createMessageComponentCollector({
		filter: (fn) => fn,
	});

	calc.on('collect', async (btn) => {
		if (btn.user.id !== authorId) {
			return btn.reply({
				content: options.othersMessage.replace('{{author}}', authorId),
				ephemeral: true,
			});
		}
		await btn.deferUpdate();
		if (btn.customId === 'calAC') {
			str = ' ';
			stringify = '```\n' + str + '\n```';
			edit();
		}
		else if (btn.customId === 'calx') {
			str += '*';
			stringify = '```\n' + str + '\n```';
			edit();
		}
		else if (btn.customId === 'cal÷') {
			str += '/';
			stringify = '```\n' + str + '\n```';
			edit();
		}
		else if (btn.customId === 'cal⌫') {
			if (str === ' ' || str === '' || str === null || str === undefined) {
				return;
			}
			else {
				str = str.split('');
				str.pop();
				str = str.join('');
				stringify = '```\n' + str + '\n```';
				edit();
			}
		}
		else if (btn.customId === 'cal=') {
			if (str === ' ' || str === '' || str === null || str === undefined) {
				return;
			}
			else {
				try {
					str += ' = ' + math.evaluate(str);
					stringify = '```\n' + str + '\n```';
					edit();
					str = ' ';
					stringify = '```\n' + str + '\n```';
				}
				catch (e) {
					str = options.invalidQuery;
					stringify = '```\n' + str + '\n```';
					edit();
					str = ' ';
					stringify = '```\n' + str + '\n```';
				}
			}
		}
		else if (btn.customId === 'calDC') {
			str = options.disabledQuery;
			stringify = '```\n' + str + '\n```';
			edit();
			calc.stop();
			lock();
		}
		else {
			str += btn.customId.replace('cal', '');
			stringify = '```\n' + str + '\n```';
			edit();
		}
	});
};