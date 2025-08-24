require('./lib/setup.js');
const { LogLevel, SapphireClient } = require('@sapphire/framework');
const { Collection, GatewayIntentBits, Partials } = require('discord.js');
const mongoose = require('mongoose');
require('dotenv').config();

const config = {
	token: process.env.token,
	applicationId: '849663572308918343',
};

const client = new SapphireClient({
	logger: {
		level: LogLevel.Info,
	},
	shards: 'auto',
	failIfNotExists: true,
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildExpressions,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
	],
	partials: [
		Partials.Channel, Partials.Message,
		Partials.Reaction, Partials.User,
		Partials.Role, Partials.GuildMember,
		Partials.GuildInvites, Partials.ManageGuild,
	],
	loadMessageCommandListeners: true,
	...(config.applicationId && { applicationId: config.applicationId }),
});

client.config = require('./config.js');
client.db = new Collection();
client.queue = new Collection();

mongoose
	.connect(process.env.mongodb_uri, { useUnifiedTopology: true, useNewUrlParser: true })
	.then(() => console.log('Success - Connected to MongoDatabase'));

const main = async () => {
	try {
		client.logger.info('Logging in');
		await client.login(process.env.token);
		client.logger.info('logged in');
	}
	catch (error) {
		client.logger.fatal(error);
	}
};

main();