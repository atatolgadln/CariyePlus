const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	getRandomID: function(length) {
		const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let result = '';
		for (let i = 0; i < length; i++) {
			result += randomChars.charAt(
				Math.floor(Math.random() * randomChars.length),
			);
		}
		return result;
	},
	addRow: function(btns) {
		const row = new ActionRowBuilder();
		for (const btn of btns) {
			row.addComponents(btn);
		}
		return row;
	},
	createButton: function(label, disabled, getRandomID) {
		let style = ButtonStyle.Secondary;
		if (label === 'AC' || label === 'DC' || label === '⌫') {
			style = ButtonStyle.Danger;
		}
		else if (label === '=') {
			style = ButtonStyle.Success;
		}
		else if (
			label === '(' ||
			label === ')' ||
			label === '^' ||
			label === '%' ||
			label === '÷' ||
			label === 'x' ||
			label === '-' ||
			label === '+' ||
			label === '.'
		) {
			style = ButtonStyle.Primary;
		}
		if (disabled) {
			const btn = new ButtonBuilder()
				.setLabel(label)
				.setStyle(style)
				.setDisabled();
			if (label === '\u200b') {
				btn.setCustomId(getRandomID(10));
			}
			else {
				btn.setCustomId('cal' + label);
			}
			return btn;
		}
		else {
			const btn = new ButtonBuilder().setLabel(label).setStyle(style);
			if (label === '\u200b') {
				btn.setDisabled();
				btn.setCustomId(getRandomID(10));
			}
			else {
				btn.setCustomId('cal' + label);
			}
			return btn;
		}
	},
};