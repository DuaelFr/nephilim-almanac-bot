const { Client, Intents } = require('discord.js');
const logger = require('winston');
const config = require('./config.json');

// Configure logger settings.
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot.
const bot = new Client({
  partials: ["CHANNEL"], // Needed for DMs.
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
});

// Log when ready.
bot.once('ready', () => {
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

// Init.
for (let i in msgHandlers) {
  msgHandlers[i].init();
}

// Handle messages.
bot.on('messageCreate', msg => {
  if (msg.content.substring(0, 1) === config.prefix) {
    const command = msg.content.split(' ')[0].substring(config.prefix.length);
    for (let i in msgHandlers) {
      msgHandlers[i].handle(command, msg);
    }
  }
});

bot.login(process.env.TOKEN);

// Answer to port HEALTH_CHECK_PORT so we can know the bot is alive.
require('http').createServer((req, res) => res.end('Ouroboros is here')).listen(process.env.HEALTH_CHECK_PORT, '0.0.0.0');
