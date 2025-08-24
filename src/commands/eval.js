const { Command } = require('@sapphire/framework');
const { EmbedBuilder, codeBlock } = require('discord.js');
const { inspect } = require('node:util');

class EvalCommand extends Command {
	constructor(context, options) {
		super(context,
			{ ...options,
				name: 'eval',
				description: 'eval (only devs)',
				preconditions: ['OwnerOnly'],
			},
		);
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('eval')
				.setDescription('eval (only devs)')
				.addStringOption((option) =>
					option
						.setName('code')
						.setDescription('write the code to evaluate')
						.setRequired(true),
				),
		);
	}

	async chatInputRun(interaction) {
		const x = interaction.options.getString('code');
		// .split(" ").join(" ")

		let res;
		try {
			res = await Promise.resolve(eval(x));
		}
		catch (e) {
			res = e;
		}

		const a = inspect(res);

		let b;

		if (a.length > 4096) {
			b = a.substr(0, 4075);
		}
		else {
			b = a;
		}

		const e = new EmbedBuilder()
			.setDescription(codeBlock('PowerShell', b))
			.setFooter({ text: `Type: ${typeof (res)}` })
			.setColor('Random');

		return interaction.reply({
			embeds: [e],
		});

		/*
    let evaled = eval(x)

    if(!typeof evaled == "string") evaled = require("util").inspect(evaled);
    const e = new EmbedBuilder()
      .setAuthor({ name: member.user.username, iconURL: member.user.avatarURL() })
      .setDescription("```PowerShell\n" + evaled + "\n```")
      .setColor("RANDOM")

    return reply({
      embeds: [e]
    })
		*/
	}
}

module.exports = {
	EvalCommand,
};