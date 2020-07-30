const Discord = require('discord.js');
const logger = require('winston');
const moment = require('moment');
const config = require('./config.json');

// Configure moment locale.
moment.locale("fr");

// Configure logger settings.
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';

// Helpers.
const buildDate = (day, month, year) => {
  const date = moment();
  date.year(parseInt(year));
  date.month(parseInt(month, 10) - 1);
  date.date(parseInt(day, 10));

  if (!date.isValid() || date.date() !== parseInt(day, 10)) {
    throw "Date invalide";
  }

  return date;
}

// Initialize Discord Bot.
const bot = new Discord.Client();

// Log when ready.
bot.on('ready', () => {
  logger.info(`Logged in as ${bot.user.tag}!`);

  bot.user.setActivity({
    name: '@JJ/MM/YYYY',
    type: "LISTENING"
  });
});

// Handle messages.
bot.on('message', msg => {
  if (msg.content.match(/^@[0-9]{2}\/[0-9]{2}\/-?[0-9]+$/)) {
    try {
      const [day, month, year] = msg.content.substr(1).split("/");
      const date = buildDate(day, month, year);

      let found = false, i = 0, n = config.monthsAlmanac.length;
      while (!found && i < n) {
        const [dayLimit, monthLimit] = config.monthsAlmanac[i].limit.split("/");
        const limit = buildDate(dayLimit, monthLimit, year);
        if (date.isSameOrBefore(limit)) {
          found = true;
        }
        else {
          i++;
        }
      }
      if (!found) {
        i = 0;
      }

      let message = [];
      let dateString = date.format("Do MMMM ");
      if (year >= 0) {
        dateString += parseInt(year, 10);
      }
      else {
        dateString += Math.abs(parseInt(year, 10)) + " av J.-C.";
      }
      const verb = date.isAfter(moment()) ? "sera" : "était";
      message.push(`Le **${dateString}** ${verb} un **${config.daysNames[date.day()]}** (${config.daysElements[date.day()]})`);
      message.push(`Éphéméride : ${config.monthsAlmanac[i].sign} / ${config.monthsAlmanac[i].star} / ${config.monthsAlmanac[i].ka}`);
      if (config.monthsAlmanac[i].day === config.daysNames[date.day()]) {
        message.push("**Grande conjonction potentielle !**");
      }
      msg.channel.send(message.join("\n"));
    }
    catch (e) {
      msg.channel.send(e);
    }
  }
});

bot.login(process.env.TOKEN);
