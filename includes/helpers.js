const Discord = require('discord.js');

/**
 * Send an error message to the client.
 *
 * @param msg
 * @param errorMessage
 */
const sendError = (msg, errorMessage) => {
  const embed = new Discord.MessageEmbed()
    .setTitle('Erreur')
    .setColor(0xff0000)
    .setDescription(errorMessage);
  msg.channel.send(embed);
}

module.exports = { sendError };
