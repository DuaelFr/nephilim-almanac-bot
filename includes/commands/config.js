const Discord = require('discord.js');
const config = require('../../config.json');
const { readFile } = require('fs').promises;
const { sendError, configGet, configSet } = require('../helpers');

function handle(command, msg) {
  if (command !== 'config') {
    return;
  }

  if (msg.channel.type === 'dm') {
    return sendError(msg, 'Cette commande ne fonctionne qu\'au sein d\'un salon, pas en message privé.');
  }

  const guild = msg.guild;
  const member = guild.member(msg.author);
  if (!member.hasPermission("ADMINISTRATOR") && !member.hasPermission("MANAGE_GUILD")) {
    return sendError(msg, 'Cette commande n\'est accessible qu\' aux membres disposant de la permission "Administrateur" ou "Gérer le serveur".');
  }

  const params = msg.content.split(' ');

  // If first param empty or "help" = show help.
  if (params.length === 1 || params[1] === 'help') {
    let validSets = Object.keys(config.cardsSets).join('*, *');

    readFile('./assets/config_help.md', {encoding: 'utf8'})
      .then((data) => {
        const response = data.replace('{{ validSets }}', validSets);
        const embed = new Discord.MessageEmbed()
          .setTitle('Aide de la commande @config')
          .setDescription(response);
        msg.channel.send(embed);
      });
  }

  // Subcommand "sets".
  else if (params[1] === 'sets') {
    // No third param = read existing config.
    if (params.length === 2) {
      configGet(guild.id, 'enabledSets')
        .then((data) => {
          let response = [];
          for (const [setName, setLabel] of Object.entries(config.cardsSets)) {
            const state = data[setName] ? 'Actif' : 'Inactif';
            const stateIcon = data[setName] ? ':unlock:' : ':lock:';
            response.push(`**${setLabel}**`);
            response.push(`Clef : ${setName}`);
            response.push(`État : ${state} ${stateIcon}`);
            response.push('');
          }
          const embed = new Discord.MessageEmbed()
            .setTitle('Configuration actuelle')
            .setDescription(response.join("\n"));
          msg.channel.send(embed);
        });
    }
    else {
      const setName = params[2];

      // Set not in the cards sets = send error.
      if (!(setName in config.cardsSets)) {
        let validSets = Object.keys(config.cardsSets).join('*, *');
        return sendError(msg, `L'ensemble de cartes *${setName}* n'existe pas. (Valeurs possibles : *${validSets}*)`);
      }

      // Toggle the state of the card set for this server (guild).
      configGet(guild.id, 'enabledSets')
        .then((data) => {
          data[setName] = !data[setName];
          configSet(guild.id, 'enabledSets', data)
            .then(() => {
              const state = data[setName] ? 'Actif' : 'Inactif';
              const stateIcon = data[setName] ? ':unlock:' : ':lock:';
              const embed = new Discord.MessageEmbed()
                .setColor('#006600')
                .setDescription(`L'ensemble des **${config.cardsSets[setName]}** est désormais **${state}** ${stateIcon}.`);
              return msg.channel.send(embed);
            });
        });
    }
  }

}

module.exports = handle;
