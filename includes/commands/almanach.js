const Discord = require('discord.js');
const moment = require('moment');
const config = require('../../config.json');
const { sendError } = require('../helpers');

// Configure moment locale.
moment.locale("fr");

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

function handle(command, msg) {
  if (command.match(/^[0-9]{2}\/[0-9]{2}\/-?[0-9]+$/)) {
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
}

module.exports = handle;
