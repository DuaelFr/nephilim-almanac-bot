const Discord = require('discord.js');
const logger = require('winston');
const config = require('./config.json');

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

// Load all message handlers.
const normalizedPath = require("path").join(__dirname, "includes/commands");
let msgHandlers = [];
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  msgHandlers.push(require("./includes/commands/" + file));
});

// Handle messages.
bot.on('message', msg => {
  if (msg.content.substr(0, 1) === config.prefix) {
    const command = msg.content.split(' ')[0].substr(config.prefix.length);
    for (let i in msgHandlers) {
      msgHandlers[i](command, msg);
    }
  }
});

bot.login(process.env.TOKEN);
