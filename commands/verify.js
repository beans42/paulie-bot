const { SlashCommandBuilder } = require('discord.js');

const VERIFIED_ROLE_ID = '1023703530378383440';

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
			//add verified role
			interaction.member.roles.add(VERIFIED_ROLE_ID);
			await interaction.reply('Verified, you can now add roles with \"/addrole\"!');
		} else {
			await interaction.reply('Invalid email or code!');
		}
	}
};