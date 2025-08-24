const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

const who = ['amongus', 'crewmate'];
const random = who[Math.floor(Math.random() * who.length)];

const asciiArt = `
           #######
        #            #
      #               #
    ###########        #
  #  ###        #       #
 #               #      #####
 #              #       ##    #
  #############         ##     #
  ##                    ##     #
  ##                    ##     #
  ##                    ##     #
  ##                    ##     #
  ##                    ##     #
  ##                    ##     #
  ##                    ##     #
`;

class AmongusCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'amongus',
			description: 'are you imposter 🤨',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('amongus')
				.setDescription('are you imposter 🤨')
				.addUserOption((option) =>
					option
						.setName('who')
						.setDescription('select user if you want')
						.setRequired(false),
				),
		);
	}

	async chatInputRun(interaction) {
		const search = interaction.options.getMember('who') || interaction.member;

		const embed = new EmbedBuilder()
			.setColor('Random')
			.setDescription(search + ' is ' + random + '\n' + asciiArt);

		return interaction.reply({ embeds: [embed] });
	}
}
module.exports = {
	AmongusCommand,
};