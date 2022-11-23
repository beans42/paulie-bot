const { SlashCommandBuilder } = require('discord.js');

const roles = {
	MATH111: '1019041204375138366',
};

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
		const subject = interaction.options.getString('subject').toUpperCase();
		
		if (!email) {
			await interaction.reply({ content: 'You are not verified, use \"/begin\"!', ephemeral: true });
			return;
		}
		
		const list = global.class_lists[subject];
		if (!list) {
			await interaction.reply({ content: `Invalid subject: ${subject}, ask for manual verification.`, ephemeral: true });
			return;
		}
		
		const student = list[email];
		if (!student && student.role !== 'Student') {
			await interaction.reply({ content: `You were not found in the classlist for ${subject}`, ephemeral: true });
			return;
		}
		
		let out_message = '';
		const role = interaction.guild.roles.cache.find(r => r.id === roles[subject]);
		if (!role.editable)
			out_message += `I'm not authorised to give ${subject} role.\n`;
		else {
			interaction.member.roles.add(role);
			out_message += `Added role for ${subject}.\n`;
		}
		
		if (!interaction.member.manageable)
			out_message += 'Can\'t set admin\'s nickname.';
		else {
			interaction.member.setNickname(student.name);
		}
		
		await interaction.reply({ content: out_message, ephemeral: true });
	}
};