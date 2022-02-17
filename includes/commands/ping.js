const { MessageEmbed } = require('discord.js');

function handle(command, msg) {
  if (command !== 'ping') {
    return;
  }
  if (msg.channel.type !== 'DM') {
    return;
  }

  const user = msg.author;
  const date = new Date(msg.createdTimestamp);
  const embed = new MessageEmbed()
    .setTitle('Pong')
    .setDescription(`Salut ${user} !
    J'ai bien reçu ton message le ${date.toLocaleDateString('fr')} à ${date.toLocaleTimeString('fr')}.
    N'hésite pas à utiliser la commande **@help** pour savoir tout ce que je peux accomplir :)`);
  msg.channel.send({ embeds: [embed] });
}

module.exports = {
  init() {},
  handle,
};
