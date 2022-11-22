const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addrole')
		.setDescription('Give yourself a role to access class-specific channel.')
		.addStringOption(option =>
			option
				.setName('subject')
				.setDescription('The class that you want to access.')
				.setRequired(true)),
	async execute(interaction) {
		const userId = interaction.user.id;
		const email = global.verified_userids[userId];
		const subject = interaction.options.getString('subject');
		if (!email) {
			await interaction.reply('You are not verified, use \"/begin\"!');
			return;
		}
		const list = global.class_lists[subject];
		if (!list) {
			await interaction.reply(`Invalid subject: ${subject}, ask for manual verification.`);
			return;
		}
		if (list[email]) {
			//add role
			await interaction.reply(`Added role for ${subject}.`);
			return;
		}
		await interaction.reply(`You were not found in the classlist for ${subject}`);
	}
};