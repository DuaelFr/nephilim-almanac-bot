const Discord = require('discord.js');
const logger = require('winston');

// Configure logger settings.
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot.
const bot = new Discord.Client();

// Log when ready.
bot.on('ready', () => {
  logger.info(`Logged in as ${bot.user.tag}!`);

  bot.user.setActivity({
    name: '@help',
    type: "LISTENING"
  });
});

const msgHandlers = [
  require('./includes/commands/help'),
  require('./includes/commands/almanach'),
];

// Handle messages.
bot.on('message', msg => {
  for (let i in msgHandlers) {
    msgHandlers[i](msg);
  }
});

bot.login(process.env.TOKEN);
