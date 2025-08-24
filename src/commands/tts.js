const { Command } = require('@sapphire/framework');
const { ChannelType, MessageFlags } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { getAudioUrl } = require('google-tts-api');

class TTSCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'tts',
			description: 'text to speech',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('tts')
				.setDescription('text to speech')
				.addStringOption((option) =>
					option
						.setName('text')
						.setDescription('the text you want to convert to speech')
						.setRequired(true),
				)
				.addChannelOption((option) =>
					option
						.setName('channel')
						.setDescription('the voice channel to play the audio in')
						.addChannelTypes(ChannelType.GuildVoice)
						.setRequired(true),
				),
		);
	}

	async chatInputRun(interaction) {
		const string = interaction.options.getString('text');
		const voiceChannel = interaction.options.getChannel('channel') || interaction.member.voice.channel;

		if (string.length > 500) return interaction.reply({ content: 'I can only speak 500 words!', flags: MessageFlags.Ephemeral });
		if (!voiceChannel) return interaction.reply({ content: 'Please join a voice channel to use this command!', flags: MessageFlags.Ephemeral });

		const audioUrl = await getAudioUrl(string, {
			lang: 'en',
			slow: false,
			host: 'https://translate.google.com',
			timeout: 20000,
		});

		const player = createAudioPlayer();
		const resource = createAudioResource(audioUrl);

		const connection = joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: interaction.channel.guild.id,
			adapterCreator: interaction.channel.guild.voiceAdapterCreator,
		});

		player.play(resource);
		connection.subscribe(player);

		player.on(AudioPlayerStatus.Idle, () => {
			connection.disconnect();
		});
		return interaction.reply({ content: 'Playing...', flags: MessageFlags.Ephemeral });
	}
}

module.exports = {
	TTSCommand,
};