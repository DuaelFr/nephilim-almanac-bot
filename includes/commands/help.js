const { MessageEmbed } = require('discord.js');
const { readFile } = require('fs').promises;

function handle(command, msg) {
  if (command !== 'help') {
    return;
  }

  readFile('./assets/help.md', {encoding: 'utf8'})
    .then((data) => {
      const embed = new MessageEmbed()
        .setTitle('Aide globale')
        .setDescription(data);
      msg.channel.send({ embeds: [embed] });
    });
}

module.exports = {
  init() {},
  handle,
};
