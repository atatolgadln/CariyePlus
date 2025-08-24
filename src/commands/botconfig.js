const { Command } = require('@sapphire/framework');
const { MessageFlags } = require('discord.js');

class BotConfigCommand extends Command {
	constructor(context, options) {
		super(context,
			{ ...options,
				name: 'botconfig',
				description: 'change bot name and avatar in global -only developers-',
				preconditions: ['OwnerOnly'],
			},
		);
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('botconfig')
				.setDescription('change bot name and avatar in global -only developers-')
				.addStringOption((option) =>
					option
						.setName('name')
						.setDescription('change bot name')
						.setRequired(false),
				)
				.addAttachmentOption((option) =>
					option
						.setName('avatar')
						.setDescription('provide a reason if u want')
						.setRequired(false),
				),
		);
	}

	async chatInputRun(interaction) {
		const { client } = this.container;

		if (interaction.options.getString('name') && interaction.options.getAttachment('avatar')) {
			client.user.setUsername(interaction.options.getString('name'));
			client.user.setAvatar(interaction.options.getAttachment('avatar').url);

			return interaction.reply({
				content: 'Name and avatar is changed',
				flags: MessageFlags.Ephemeral,
			});
		}

		if (interaction.options.getString('name') & !interaction.options.getAttachment('avatar')) {
			client.user.setUsername(interaction.options.getString('name'));
			return interaction.reply({
				content: 'Name is changed',
				flags: MessageFlags.Ephemeral,
			});
		}
		if (!interaction.options.getString('name') & interaction.options.getAttachment('avatar')) {
			interaction.deferReply();
			try {
				client.user.setAvatar(interaction.options.getAttachment('avatar').url);
				return interaction.editReply({
					content: 'Avatar is changed',
					flags: MessageFlags.Ephemeral,
				});
			}
			catch (error) {
				console.log(error);
				return interaction.editReply({
					content: 'An error occurred while changing the avatar',
					flags: MessageFlags.Ephemeral,
				});
			}
		}
	}
}

module.exports = {
	BotConfigCommand,
};