module.exports = {
	formatSupported: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
	findStickers: async function(interaction, OldName, guild) {
		return guild.stickers.fetch().then(async (stickers) => {
			return await stickers.find((sticker) => sticker.name === OldName);
		}).catch(() => {
			return;
		});
	},
	remove: async function(client, interaction, guild) {
		const Oldname = interaction.options.getString('name');
		const findSticker = await module.exports.findStickers(interaction, Oldname, guild);
		if (!findSticker) return;

		await findSticker.delete().catch(() => {
			return;
		});


		return true;
	},
	edit: async function(client, interaction, guild) {
		const NewName = interaction.options.getString('newname');
		const OldName = interaction.options.getString('oldname');

		const findSticker = await module.exports.findStickers(interaction, OldName);
		if (!findSticker) return;

		await guild.stickers.edit(findSticker.id, { name: NewName }).catch((() => {
			return;
		}));

		return true;
	},
	upload: async function(client, interaction, guild) {
		const file = await interaction.options.getAttachment('image');
		console.log(file);
		const name = interaction.options.getString('name');
		if (!module.exports.formatSupported.includes(`${file.contentType}`)) return;

		const final = await guild.stickers.create({ file: file.attachment, name: `${name}` }).catch((() => {
			return;
		}));

		if (!final) return false;
		return true;
	},
};