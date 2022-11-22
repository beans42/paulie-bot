const { SlashCommandBuilder } = require('discord.js');

const randomCode = () => Math.floor(Math.random()*90000) + 10000;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('begin')
		.setDescription('Starts enrollment verification process.')
		.addStringOption(option =>
			option
				.setName('email')
				.setDescription('Your official Queen\'s University email.')
				.setRequired(true)),
	async execute(interaction) {
		const userId = interaction.user.id;
		const to = interaction.options.getString('email');
		if (to.endsWith('@queensu.ca')) {
			const code = randomCode();
			global.open_verifications[userId] = { email: to, code };
			await global.sendEmail(to, code);
			await interaction.reply('Sent email, please enter 5 digit code with \"/verify\".');
		} else {
			await interaction.reply('Must be official Queen\'s University email.');
		}
	}
};