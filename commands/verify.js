const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('Starts enrollment verification process.')
		.addIntegerOption(option =>
			option
				.setName('code')
				.setDescription('The 5-digit code that was sent to your email.')
				.setRequired(true)),
	async execute(interaction) {
		const userId = interaction.user.id;
		const code = interaction.options.getInteger('code');
		if (code === global.open_verifications[userId]?.code) {
			global.verified_userids[userId] = global.open_verifications[userId].email;
			delete global.open_verifications[userId];
			await interaction.reply('Verified, you can now add roles with \"/addrole\"!');
		} else {
			await interaction.reply('Invalid email or code!');
		}
	}
};