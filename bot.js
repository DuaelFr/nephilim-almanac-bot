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

const sendError = (msg, errorMessage) => {
  const embed = new Discord.MessageEmbed()
    .setTitle('Erreur')
    .setColor(0xff0000)
    .setDescription(errorMessage);
  msg.channel.send(embed);
}

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

// Handle messages.
bot.on('message', msg => {
  if (msg.content === '@help') {
    let response = [];
    response.push('**Obtenir l\'almanach du jour** :');
    response.push('Permet de connaître le jour de la semaine, son élément et les conjonctions potentielles.');
    response.push('Syntaxe : @JJ/MM/YYYY');
    response.push('Exemples : @01/01/2017 ou @30/06/-152');
    msg.channel.send(response.join("\n"));
  }
  else if (msg.content.match(/^@[0-9]{2}\/[0-9]{2}\/-?[0-9]+$/)) {
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

      let dateString = date.format("Do MMMM ");
      if (year >= 0) {
        dateString += parseInt(year, 10);
      }
      else {
        dateString += Math.abs(parseInt(year, 10)) + " av J.-C.";
      }
      const verb = date.isAfter(moment()) ? "sera" : "était";

      let message = [];
      message.push(`Ce jour ${verb} un **${config.daysNames[date.day()]}** (${config.daysElements[date.day()]})`);
      message.push(`Éphéméride : ${config.monthsAlmanac[i].sign} / ${config.monthsAlmanac[i].star} / ${config.monthsAlmanac[i].ka}`);
      if (config.monthsAlmanac[i].day === config.daysNames[date.day()]) {
        message.push("**Grande conjonction potentielle !**");
      }

      const embed = new Discord.MessageEmbed()
        .setTitle(dateString)
        .setColor(`#${config.daysElementsColors[date.day()]}`)
        .setDescription(message.join("\n"));
      msg.channel.send(embed);
    }
    catch (e) {
      return sendError(msg, e);
    }
  }
});

bot.login(process.env.TOKEN);
