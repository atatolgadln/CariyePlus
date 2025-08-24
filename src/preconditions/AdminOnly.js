/* eslint-disable no-shadow */
const { AllFlowsPrecondition } = require('@sapphire/framework');
const { owners } = require('../config.json');

const message = 'You need the following permissions to execute this command: Administrator';
class UserPrecondition extends AllFlowsPrecondition {
	/**
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	chatInputRun(interaction) {
		return this.doOwnerCheck(interaction.user.id);
	}

	/**
	 * @param {import('discord.js').ContextMenuCommandInteraction} interaction
	 */
	contextMenuRun(interaction) {
		return this.doOwnerCheck(interaction.user.id);
	}

	/**
	 * @param {import('discord.js').Message} message
	 */
	messageRun(message) {
		return this.doOwnerCheck(message.author.id);
	}

	/**
	 * @param {import('discord.js').Snowflake} userId
	 */
	doOwnerCheck(userId) {
		return owners.includes(userId) ? this.ok() : this.error({ message });
	}
}

module.exports = {
	UserPrecondition,
};