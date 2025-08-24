/* eslint-disable no-shadow */
const { Command } = require('@sapphire/framework');
const { EmbedBuilder, ChannelType, GuildVerificationLevel, GuildExplicitContentFilter, GuildNSFWLevel, time } = require('discord.js');

class ServerInfoCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'serverinfo',
			description: 'shows server info',
		});
	}

	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('serverinfo')
				.setDescription('shows server info'),
		);
	}

	async chatInputRun(interaction) {
		const guild = { interaction };
		const { members, channels, emojis, roles, stickers } = guild;

		const sortedRoles = roles.cache.map(role => role).slice(1, roles.cache.size).sort((a, b) => b.position - a.position);
		const userRoles = sortedRoles.filter(role => !role.managed);
		const managedRoles = sortedRoles.filter(role => role.managed);
		const botCount = members.cache.filter(member => member.user.bot).size;

		const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
			let totalLength = 0;
			const result = [];

			for (const role of roles) {
				const roleString = `<@&${role.id}>`;

				if (roleString.length + totalLength > maxFieldLength) break;

				totalLength += roleString.length + 1;
				result.push(roleString);
			}

			return result.length;
		};

		const splitPascal = (string, separator) => string.split(/(?=[A-Z])/).join(separator);
		const toPascalCase = (string, separator = false) => {
			const pascal = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
			return separator ? splitPascal(pascal, separator) : pascal;
		};

		const getChannelTypeSize = type => channels.cache.filter(channel => type.includes(channel.type)).size;

		const totalChannels = getChannelTypeSize([
			ChannelType.GuildText,
			ChannelType.GuildVoice,
			ChannelType.GuildStageVoice,
			ChannelType.GuildForum,
			ChannelType.GuildCategory,
		]);

		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor('Random')
					.setTitle(`${guild.name}'s Information`)
					.setThumbnail(guild.iconURL({ size: 4096 }))
					.setImage(guild.bannerURL({ size: 4096 }))
					.addFields([
						{
							name: 'Description',
							value: `📝 ${guild.description || 'None'}`,
						},
						{
							name: 'General',
							value: [
								`📜 **Created** ${time(guild.createdTimestamp, 'F')}`,
								`💳 **ID** ${guild.id}`,
								`👑 **Owner** <@${guild.ownerId}>`,
								`🌍 **Language** ${new Intl.DisplayNames(['en'], { type: 'language' }).of(guild.preferredLocale)}`,
								`💻 **Vanity URL** ${guild.vanityURLCode || 'None'}`,
							].join('\n'),
						},
						{ name: 'Features',
							value: guild.features?.map(feature => `- ${toPascalCase(feature, ' ')}`)?.join('\n') || 'None',
							inline: true,
						},
						{
							name: 'Security',
							value: [
								`👀 **Explicit Filter** ${splitPascal(GuildExplicitContentFilter[guild.explicitContentFilter], ' ')}`,
								`🔞 **NSFW Level** ${splitPascal(GuildNSFWLevel[guild.nsfwLevel], ' ')}`,
								`🔒 **Verification Level** ${splitPascal(GuildVerificationLevel[guild.verificationLevel], ' ')}`,
							].join('\n'),
							inline: true,
						},
						{
							name: `Users (${guild.memberCount})`,
							value: [
								`👨‍👩‍👧‍👦 **Members** ${guild.memberCount - botCount}`,
								`🤖 **Bots** ${botCount}`,
							].join('\n'),
							inline: true,
						},
						{
							name: `User Roles (${maxDisplayRoles(userRoles)} of ${userRoles.length})`,
							value: `${userRoles.slice(0, maxDisplayRoles(userRoles)).join(' ') || 'None'}`,
						},
						{
							name: `Managed Roles (${maxDisplayRoles(managedRoles)} of ${managedRoles.length})`,
							value: `${managedRoles.slice(0, maxDisplayRoles(managedRoles)).join(' ') || 'None'}`,
						},
						{
							name: `Channels, Threads & Categories (${totalChannels})`,
							value: [
								`💬 **Text** ${getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildForum])}`,
								`🎙 **Voice** ${getChannelTypeSize([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}`,
								`🧵 **Threads** ${getChannelTypeSize([ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread, ChannelType.GuildNewsThread])}`,
								`📑 **Categories** ${getChannelTypeSize([ChannelType.GuildCategory])}`,
							].join('\n'),
							inline: true,
						},
						{
							name: `Emojis & Stickers (${emojis.cache.size + stickers.cache.size})`,
							value: [
								`📺 **Animated** ${emojis.cache.filter(emoji => emoji.animated).size}`,
								`🗿 **Static** ${emojis.cache.filter(emoji => !emoji.animated).size}`,
								`🏷 **Stickers** ${stickers.cache.size}`,
							].join('\n'),
							inline: true,
						},
						{
							name: 'Nitro',
							value: [
								`📈 **Tier** ${guild.premiumTier || 'None'}`,
								`💪🏻 **Boosts** ${guild.premiumSubscriptionCount}`,
								`💎 **Boosters** ${guild.members.cache.filter(member => member.roles.premiumSubscriberRole).size}`,
								`🏋🏻‍♀️ **Total Boosters** ${guild.members.cache.filter(member => member.premiumSince).size}`,
							].join('\n'),
							inline: true,
						},
						{
							name: 'Banner',
							value: guild.bannerURL() ? '** **' : 'None',
						},
					]),
			],
		});
	}
}

module.exports = {
	ServerInfoCommand,
};