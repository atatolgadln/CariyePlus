const { Command } = require('@sapphire/framework');
const { EmbedBuilder, MessageFlags } = require('discord.js');

class RoleInfoCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'roleinfo',
			description: 'shows roles info',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('roleinfo')
				.setDescription('shows roles info')
				.addRoleOption((option) =>
					option
						.setName('role')
						.setDescription('select a role')
						.setRequired(true),
				),
		);
	}

	async chatInputRun(interaction) {
		const targetRole = interaction.options.getRole('role');

		const e = new EmbedBuilder()
			.setTitle(`:satellite: ${targetRole.name}'s Info`)
			.setColor(targetRole.hexColor || 'Random')
			.addFields([
				{ name: ':id: Role Id', value: targetRole.id, inline: true },
				{ name: ':curly_loop: Role Position', value: targetRole.position.toString(), inline: true },
				{ name: ':person_frowning: Member Size', value: targetRole.members.size.toString(), inline: true },
				{ name: 'Role Is Separate From Others ?', value: targetRole.hoist.toString(), inline: true },
				{ name: 'Role Is Mentionable?', value: targetRole.mentionable.toString(), inline: true },
				{ name: 'Role Permissions', value: targetRole.permissions.toArray().join(',\n') },
			]);
		if (targetRole.iconURL()) e.setThumbnail(targetRole.iconURL({ dynamic: true, format: 'png', size: 4096 }));

		return interaction.reply({ embeds: [e], flags: MessageFlags.Ephemeral });
	}
}

module.exports = {
	RoleInfoCommand,
};