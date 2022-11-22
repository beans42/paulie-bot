const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token, gmail_user, gmail_pass } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const nodemailer = require('nodemailer');

//map from discord user id to an object like
//{ email: 'xxx@queensu.ca', code: '3453452' }
global.open_verifications = {};

//map from userids to queens email
global.verified_userids = JSON.parse(fs.readFileSync('verified_userids.json'));

//will contain every classlist in ./classes
//eg. ./classes/MATH111.json gets stored as class_lists['MATH111']
global.class_lists = {};

const classesPath = path.join(__dirname, 'classes');
for (const file of fs.readdirSync(classesPath)) {
	const filePath = path.join(classesPath, file);
	global.class_lists[file.slice(0, -5)] = require(filePath);
}

setInterval(() => {
	fs.writeFileSync('verified_userids.json', JSON.stringify(verified_userids, null, '\t'));
}, 5000);

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: gmail_user,
		pass: gmail_pass
	}
});

global.sendEmail = async (to, code) => {
	await transporter.sendMail({
		from: gmail_user,
		to,
		subject: 'Hello World',
		text: `Your verification code is ${code}.`
	});
};

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand())
		return;

	const command = client.commands.get(interaction.commandName);

	if (!command)
		return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);