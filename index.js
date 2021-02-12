const Discord = require('discord.js');
const client = new Discord.Client();
const ping = require('./ping');
const dbA = require('@replit/database');
const db = new dbA();
const { whitelisted, bannedwords } = require('./config');

const AntiSpam = require('discord-anti-spam');
const antiSpam = new AntiSpam({
	warnThreshold: 5,
	kickThreshold: 15,
	banThreshold: 20,
	maxInterval: 12000,
	warnMessage: '{@user}, Please stop being cringe',
	kickMessage: '**{user_tag}** has been kicked for cringe.',
	banMessage: '**{user_tag}** has been banned for cringe.',
	maxDuplicatesWarning: 5,
	maxDuplicatesKick: 10,
	maxDuplicatesBan: 20,
	exemptPermissions: [],
	ignoreBots: false,
	verbose: true,
	ignoredUsers: whitelisted
});
client.on('message', async message => {
	const args = message.content.slice(process.env.prefix.length).split(/ +/g);
	const command = args.shift().toLowerCase();
	let guild = message.guild;
	const role = guild.roles.cache.find(role => role.name === 'Muted');
	let member;

	const friend = guild.roles.cache.find(
		role => role.name === "selectthegang's friend"
	);

	const simp = guild.roles.cache.find(role => role.name === 'SIMP');

	const img = guild.roles.cache.find(role => role.name === 'no img');

	if (message.content.includes(process.env.prefix + 'simp')) {
		message.member.roles.add(simp).then(message.react('👍'));
	}
	if (message.content.includes(process.env.prefix + 'rmsimp')) {
		message.member.roles.remove(simp).then(message.react('👍'));
	}
	if (message.content.includes(process.env.prefix + 'add')) {
		if (message.author.id === '564164277251080208') {
			member = message.mentions.members.first();
			member.roles
				.add(friend)
				.then(
					message.channel.send(
						`added <@${member.id}> as selectthegang's friend`
					)
				);
		} else {
			return message.channel.send("you're not selectthegang");
		}
	}
	if (message.content.includes(process.env.prefix + 'remove')) {
		if (message.author.id === '564164277251080208') {
			member = message.mentions.members.first();
			member.roles
				.remove(friend)
				.then(
					message.channel.send(
						`removed <@${member.id}> as selectthegang's friend`
					)
				);
		} else {
			return message.channel.send("you're not selectthegang");
		}
	}
	if (message.content.includes(process.env.prefix + 'img-remove')) {
		if (whitelisted.includes(message.author.id)) {
			member = message.mentions.members.first();
			member.roles
				.add(img)
				.then(message.channel.send(`removed <@${member.id}>'s image perms`));
		} else {
			return message.channel.send("you're not whitelisted");
		}
	}
	if (message.content.includes(process.env.prefix + 'img-add')) {
		if (whitelisted.includes(message.author.id)) {
			member = message.mentions.members.first();
			member.roles
				.remove(img)
				.then(message.channel.send(`added <@${member.id}>'s image perms`));
		} else {
			return message.channel.send("you're not whitelisted");
		}
	}
	if (message.content.includes(process.env.prefix + 'reason')) {
		if (whitelisted.includes(message.author.id)) {
			member = message.mentions.members.first();
			const value = await db.get(member['user'].username);
			if (value === null) {
				return message.channel.send(
					new Discord.MessageEmbed()
						.setTitle(member['user'].tag + ' is not muted')
						.setColor('RANDOM')
				);
			} else {
				message.channel.send(
					new Discord.MessageEmbed()
						.setTitle(member['user'].tag)
						.addField('Reason: ', value, true)
						.setColor('RANDOM')
				);
			}
		} else {
			return message.channel.send("you're not whitelisted");
		}
	}
	if (message.content.includes(process.env.prefix + 'list')) {
		if (whitelisted.includes(message.author.id)) {
			let muted = await db.list();
			if (muted.length < 1) {
				return message.channel.send(
					new Discord.MessageEmbed()
						.setTitle(client.user.tag + "'s List")
						.setDescription('there are no muted users')
						.setColor(`RANDOM`)
				);
			} else {
				return message.channel.send(
					new Discord.MessageEmbed()
						.setTitle(client.user.tag + "'s List")
						.addField(`MUTED USERS:\n`, muted, true)
						.setColor(`RANDOM`)
				);
			}
		}
	}
	if (message.content.includes(process.env.prefix + 'mute')) {
		if (whitelisted.includes(message.author.id)) {
			const hmms = guild.roles.cache.find(role => role.name === 'Muted');
			const toMilliseconds = require('to-milliseconds');
			const ms = toMilliseconds.fromMinutes(args[1]);
			const reason = message.content
				.split(' ')
				.slice(3)
				.join(' ');

			member = message.mentions.members.first();
			db.set(member['user'].username, reason);
			member.roles
				.add(hmms)
				.then(
					message.channel.send(
						new Discord.MessageEmbed()
							.setTitle(`muted ${member['user'].tag}`)
							.addField(`Duration: `, args[1] + ` minutes`, true)
							.addField('Reason: ', reason, true)
							.setColor('RANDOM')
					)
				)
				.then(
					client.users.fetch(member.id).then(user => {
						user.send(
							new Discord.MessageEmbed()
								.setTitle('you have been muted')
								.addField('Duration: ', args[1] + ' Minutes')
								.addField('Reason: ', reason, true)
								.setColor('RANDOM')
						);
					})
				);
			setTimeout(function() {
				member.roles
					.remove(hmms)
					.then(message.channel.send(`welcome back, <@${member.id}>`))
					.then(db.delete(member['user'].username));
			}, ms);
		} else {
			return message.channel.send("you're not whitelisted");
		}
	}
	if (message.content.includes(process.env.prefix + 'unmute')) {
		if (whitelisted.includes(message.author.id)) {
			const hmms = guild.roles.cache.find(role => role.name === 'Muted');
			member = message.mentions.members.first();
			member.roles
				.remove(hmms)
				.then(
					message.channel
						.send(`unmuted <@${member.id}>`)
						.then(db.delete(member['user'].username))
				);
		} else {
			return message.channel.send("you're not whitelisted");
		}
	}
	if (whitelisted.includes(message.author.id)) {
		return;
	} else {
		let foundInText = false;
		for (let i in bannedwords) {
			if (
				message.content
					.replace(' ', '')
					.toLowerCase()
					.includes(bannedwords[i])
			)
				foundInText = true;
		}

		if (foundInText) {
			message.delete();
			member = message.member;
			member.roles
				.add(role)
				.then(db.set(message.author.username, 'saying a prohibited word'));
			setTimeout(function() {
				member.roles.remove(role);
				db.delete(message.author.username);
			}, 60000);

			message.channel
				.send(
					new Discord.MessageEmbed()
						.addField(
							`WARNING: `,
							`<@${
								message.author.id
							}> has been muted for 1 minute | Reason: saying a prohibited word`,
							true
						)
						.setColor('RANDOM')
				)
				.then(
					message.author.send(
						new Discord.MessageEmbed()
							.addField(
								`you have been muted for 1 minute`,
								'Reason: saying a prohibited word',
								true
							)
							.setColor('RANDOM')
					)
				);
		}
	}
});
client.on('ready', async function() {
	console.log(`Logged in as ${client.user.tag}.`);
	client.user.setStatus('online');
	client.user.setActivity('for bad behavior', { type: 'WATCHING' });
});
client.on('message', message => antiSpam.message(message));
client.login(process.env.MAIN);
