const Discord = require('discord.js');
const client = new Discord.Client();
const { bannedwords } = require('./config');
const AntiSpam = require('discord-anti-spam');
const website = require('./website');
db = require('./database/mongo');
let prefix = process.env.prefix;


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
  ignoredUsers: []
});
client.on('message', async message => {
  let whitelisted = await db.whitelist.check(message.author.id);
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
    if (whitelisted) {
      member = message.mentions.members.first();
      member.roles
        .add(img)
        .then(message.channel.send(`removed <@${member.id}>'s image perms`));
    } else {
      return message.channel.send("you're not whitelisted");
    }
  }
  if (message.content.includes(process.env.prefix + 'img-add')) {
    if (whitelisted) {
      member = message.mentions.members.first();
      member.roles
        .remove(img)
        .then(message.channel.send(`added <@${member.id}>'s image perms`));
    } else {
      return message.channel.send("you're not whitelisted");
    }
  }
  if (message.content.includes(process.env.prefix + 'reason')) {
    if (whitelisted) {
      member = message.mentions.members.first();
      const value = await db.mod.get(member['user'].username);
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
            .addField('Reason: ', "```" + value.reason + "```", true)
            .addField('Duration: ', "```" + value.time + " minutes```", true)
            .setColor('RANDOM')
        );
      }
    } else {
      return message.channel.send("you're not whitelisted");
    }
  }
  if (message.content.includes(process.env.prefix + 'list')) {
    if (whitelisted) {
      let muted = await db.mod.list();
      const entries = await db.mod.list();
      let fields = [];
      let i = 0
      entries.forEach(v => {
        i++
        fields.push({ name: i + '.', value: `${v.id}`, inline: true })
      });
      message.channel.send(
        new Discord.MessageEmbed()
          .setTitle(`${client.user.tag}'s list:`)
          .setColor('RANDOM')
          .addFields(fields))
        ();
    }
    else {
      return message.channel.send("you're not whitelisted");
    }
  }
  if (message.content.includes(process.env.prefix + 'mute')) {
    if (whitelisted) {
      const hmms = guild.roles.cache.find(role => role.name === 'Muted');
      const toMilliseconds = require('to-milliseconds');
      const ms = toMilliseconds.fromMinutes(args[1]);
      const reason = message.content
        .split(' ')
        .slice(3)
        .join(' ');

      member = message.mentions.members.first();
      db.mod.set(member['user'].username, args[1], reason);
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
          .then(db.mod.delete(member['user'].username));
      }, ms);
    } else {
      return message.channel.send("you're not whitelisted");
    }
  }
  if (message.content.startsWith(`${prefix}whitelist`)) {
    if (whitelisted) {
      let mentioneduser = message.mentions.members.first();
      db.whitelist.addUser(mentioneduser)
      message.channel.send('whitelisted user')
    }
    else {
      return message.channel.send("you aren't whitelisted")
    }
  }
  if (message.content.startsWith(`${prefix}unwhitelist`)) {
    if (whitelisted) {
      let mentioneduser = message.mentions.members.first();
      db.whitelist.delUser(mentioneduser)
      message.channel.send('unwhitelisted user')
    }
    else {
      return message.channel.send("you aren't whitelisted")
    }
  }
  if (message.content.includes(process.env.prefix + 'unmute')) {
    if (whitelisted) {
      const hmms = guild.roles.cache.find(role => role.name === 'Muted');
      member = message.mentions.members.first();
      member.roles
        .remove(hmms)
        .then(
          message.channel
            .send(`unmuted <@${member.id}>`)
            .then(db.mod.delete(member['user'].username))
        );
    } else {
      return message.channel.send("you're not whitelisted");
    }
  }
  if (whitelisted) {
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
        .then(db.mod.set(message.author.username, '1', 'saying a prohibited word'));
      setTimeout(function() {
        member.roles.remove(role);
        db.mod.delete(message.author.username);
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
  db.connect(process.env.MONGO);
  client.user.setActivity('for bad behavior', { type: 'WATCHING' });
});
client.on('message', message => antiSpam.message(message));
client.login(process.env.MAIN);