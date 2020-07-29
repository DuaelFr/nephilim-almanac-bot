const Discord = require('discord.js');
const logger = require('winston');

const daysNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
const bot = new Discord.Client();

bot.on('ready', () => {
    logger.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if (msg.content.match(/^@[0-9]{2}\/[0-9]{2}\/-?[0-9]+$/)) {
    const [day, month, year] = msg.content.substr(1).split('/');
    const date = new Date(year, month, day);

    msg.channel.send(`Le ${day}/${month}/${year} était un ${daysNames[date.getDay()]}`);
  }
});

bot.login(process.env.TOKEN);
